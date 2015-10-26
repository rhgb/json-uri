# json-uri

**json-uri** is a simple uri-compatible json translator with notable advantages:

* Browser-compatible with no dependencies and size of less than 1kB
* 25% ~ 40% size deduction when uri-encoded, comparing to uri-encoded JSON string

json-uri searches for unused characters in provided string, and then replaces most commonly seen characters (`{` `}` `.` `:` etc.) and sequences (`","` `":"` etc.) in JSON strings with them. This provides significant improvement on encoded string length with reasonable cost.

json-uri has some difference from similar packages like `json-url` and `juri`:

* It doesn't concern about readability. JSON strings are rarely readable without multi-line formatting, so as a single-line string, trying to keep encoded string readable is commonly useless.
* It doesn't apply compressing algorithm or other complex methods to further reduce encoded length, for following reasons:
    + most common usage of uri-compatible json translating is to pass JSON objects through web urls, and
    + url parameters longer than 2kB or 4kB are usually considered unsafe due to browser and server limitations, so
    + it is necessary to reduce a 1000-byte encoded string to 700 byte, but not from 700 byte to 680 byte with a lot more code.
* It doesn't accept custom dictionaries, because it introduces extra coupling into your code. Just use shorter parameter names if you need.

## Usage

```javascript
var ju = require('json-uri');
var jsonStr = JSON.stringify(obj);
var encodedStr = ju.encode(jsonStr);
var decodedStr = ju.decode(encodedStr);
```

## TODO

* Add more test cases.