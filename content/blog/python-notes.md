---
title: Python
slug: python-notes
date: '2015-08-21T20:38:42.000Z'
excerpt: >-
  Methods that use dot notation only work with strings.
canonicalUrl: ''
featureImage: ''
draft: true

---
python3.6 -m venv

Related reading: [[whiteboard|Whiteboard]] and [[debugging-dating|Debugging Dating]].

## Basics

```python
# setting up variables… easy
my_variable = "deez nuts"
your_mama_is_fat = True
c = "cats"[0] # 'c'

"""
MULTILINE COMMENT BITCH
"""
```

### Imports

```python
import math            # Imports the math module
everything = dir(math) # Sets everything to a list of things from math
print everything       # Prints 'em all!
```

### String Methods

Methods that use dot notation only work with strings. On the other hand, `len()` and `str()` can work on other data types. Sometimes you need to combine a string with something that isn't a string. In order to do that, you have to convert the non-string into a string.

*   len()
    *   `len("Parrot")`
*   lower()
    *   `"Parrot".lower()`
*   upper()
    *   `"Parrot".upper()`
*   str()
    *   `str(3.145)`

You can also format strings with out concatenating by using `%`:

```python
name = raw_input("What is your name?")
quest = raw_input("What is your quest?")
color = raw_input("What is your favorite color?")

print "Ah, so your name is %s, your quest is %s, \
and your favorite color is %s." % (name, quest, color)
```

### Math

There are also some builtin math functions: `min`, `max`, `abs`.

### Dates

```python
from datetime import datetime
now = datetime.now()
current_year = now.year
current_month = now.month
current_day = now.day

print now
print current_year
print current_month
print current_day
print '%s/%s/%s' % (now.month, now.day, now.year)
print '%s:%s:%s' % (now.hour, now.minute, now.second)
```

### Functions

```python
def shut_down(s):
    if s.lower() == ('yes' or 'y'):
        return 'Shutting down'
    elif s.lower() == ('no' or 'n'):
        return 'Shutdown aborted'
    else:
        return 'Sorry'
```

#### Conditionals

*   Comparators: `==`, `!=`, `>`, `>=`, `<`, and `<=`.
*   Boolean operators (in order of operations): `not`, `and`, `or`

#### Control Flow

Most importantly, you need to know if-else.

```python
if 8 > 9:
    print "I don't get printed!"
elif 8 < 9:
    print "I get printed!"
else:
    print "I also don't get printed!"
```

You also really need to understand for loops.

### Lists & Dictionaries

#### Lists

Similar to an array in javascript, lists are a datatype for storing collections of different pieces of information. It has some methods:

*   append `append(zoo_animals)`
*   slice `zoo_animals[1:4]`
*   index `zoo_animals.index("sloth")`
*   insert `zoo_animals.insert(1, "dog")`
*   sort `zoo_animals.sort()`
*   remove `zoo_animals.remove("dog")`

```python
zoo_animals = ["pangolin", "cassowary", "sloth", "me" ];
zoo_animals.append("tortoise")
```

You can also use the slice method on strings.

```python
animals = "catdogfrog"
cat  = animals[:3]   # The first three characters of animals
dog  = animals[3:6]               # The fourth through sixth characters
frog = animals[6:]              # From the seventh character to the end
```

#### Dictionaries

A dictionary is similar to a list, but you access values by looking up a key instead of an index. A key can be any string or number. Dictionaries are enclosed in curly braces. This is very similar to an object in javascript. Unlike in javascript, dictionaries have a length. There are a few methods for dictionaries:

*   `del menu['Chicken']`

#### Reading/Writing Files

```python
f = open(‘work file’, ‘w’)
mode: w = write, r = read
f.read()
f.readline()
f.close()
```

### Debugging & Errors

```python
pdb.set_trace()
# c - continue
```

Especially worth considering **ipdb** for iPython. This features tab completions and object introspection . It also features food syntax highlighting

*   start automatically on [exception](http://code.activestate.com/recipes/65287/)
*   Python [error types](https://docs.python.org/2/tutorial/errors.html)
