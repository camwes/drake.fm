export type WikilinkReference = {
  slug: string;
  title: string;
  href: string;
};

export type WikilinkIssue = {
  target: string;
  message: string;
};

type WikilinkCandidate = {
  slug: string;
  title: string;
};

type WikilinkResolver = {
  bySlug: Map<string, WikilinkCandidate>;
  byNormalizedSlug: Map<string, WikilinkCandidate>;
  byTitleOrAlias: Map<string, WikilinkCandidate[]>;
};

type RewriteResult = {
  content: string;
  outboundLinks: WikilinkReference[];
  issues: WikilinkIssue[];
};

const WIKILINK_PATTERN = /\[\[([^[\]]+)\]\]/g;

export function createWikilinkResolver(
  candidates: Array<WikilinkCandidate & { aliases: string[] }>,
): WikilinkResolver {
  const bySlug = new Map<string, WikilinkCandidate>();
  const byNormalizedSlug = new Map<string, WikilinkCandidate>();
  const byTitleOrAlias = new Map<string, WikilinkCandidate[]>();

  for (const candidate of candidates) {
    bySlug.set(candidate.slug, candidate);
    byNormalizedSlug.set(normalizeLookupValue(candidate.slug), candidate);

    for (const name of [candidate.title, ...candidate.aliases]) {
      const key = normalizeLookupValue(name);
      if (!key) {
        continue;
      }

      const matches = byTitleOrAlias.get(key) ?? [];
      matches.push(candidate);
      byTitleOrAlias.set(key, matches);
    }
  }

  return {
    bySlug,
    byNormalizedSlug,
    byTitleOrAlias,
  };
}

export function rewriteWikilinks(content: string, resolver: WikilinkResolver): RewriteResult {
  const outboundBySlug = new Map<string, WikilinkReference>();
  const issues: WikilinkIssue[] = [];
  const rewrittenLines: string[] = [];
  let inFence = false;

  for (const line of content.split("\n")) {
    if (isFenceLine(line)) {
      inFence = !inFence;
      rewrittenLines.push(line);
      continue;
    }

    if (inFence) {
      rewrittenLines.push(line);
      continue;
    }

    const segments = line.split(/(`+[^`]*`+)/g);
    const rewrittenSegments = segments.map((segment) => {
      if (segment.startsWith("`") && segment.endsWith("`")) {
        return segment;
      }

      return segment.replace(WIKILINK_PATTERN, (_match, rawBody: string) => {
        const parsed = parseWikilinkBody(rawBody);
        const resolution = resolveWikilink(parsed.target, resolver);

        if (!resolution.ok) {
          issues.push({
            target: parsed.target,
            message: resolution.message,
          });
          return `[[${rawBody}]]`;
        }

        const label = parsed.label || resolution.candidate.title;
        const reference = {
          slug: resolution.candidate.slug,
          title: resolution.candidate.title,
          href: `/blog/${resolution.candidate.slug}`,
        };
        outboundBySlug.set(reference.slug, reference);

        return `[${escapeMarkdownLabel(label)}](${reference.href})`;
      });
    });

    rewrittenLines.push(rewrittenSegments.join(""));
  }

  return {
    content: rewrittenLines.join("\n"),
    outboundLinks: Array.from(outboundBySlug.values()),
    issues,
  };
}

function parseWikilinkBody(body: string): { target: string; label: string } {
  const [targetPart, ...labelParts] = body.split("|");
  return {
    target: targetPart.trim(),
    label: labelParts.join("|").trim(),
  };
}

function resolveWikilink(
  target: string,
  resolver: WikilinkResolver,
):
  | { ok: true; candidate: WikilinkCandidate }
  | { ok: false; message: string } {
  const trimmedTarget = target.trim();
  if (!trimmedTarget) {
    return {
      ok: false,
      message: "Empty wikilink target",
    };
  }

  const exactSlugMatch = resolver.bySlug.get(trimmedTarget);
  if (exactSlugMatch) {
    return { ok: true, candidate: exactSlugMatch };
  }

  const normalizedTarget = normalizeLookupValue(trimmedTarget);
  const normalizedSlugMatch = resolver.byNormalizedSlug.get(normalizedTarget);
  if (normalizedSlugMatch) {
    return { ok: true, candidate: normalizedSlugMatch };
  }

  const titleOrAliasMatches = resolver.byTitleOrAlias.get(normalizedTarget) ?? [];
  if (titleOrAliasMatches.length === 1) {
    return { ok: true, candidate: titleOrAliasMatches[0] };
  }

  if (titleOrAliasMatches.length > 1) {
    return {
      ok: false,
      message: `Ambiguous wikilink target "${trimmedTarget}"`,
    };
  }

  return {
    ok: false,
    message: `Unresolved wikilink target "${trimmedTarget}"`,
  };
}

function isFenceLine(line: string): boolean {
  const trimmedLine = line.trimStart();
  return trimmedLine.startsWith("```") || trimmedLine.startsWith("~~~");
}

function escapeMarkdownLabel(label: string): string {
  return label.replace(/[[\]]/g, "\\$&");
}

export function normalizeLookupValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
