# code conventions

## general

- user experience guides all decisions
- avoid over-engineering
- keep things minimal and simple
- use browser defaults and server rendering as much as possible, followed by htmx, followed by frontend js
    - tho user experience is king. eg. a UI loading state if needs frontend js, then let it be

## typescript

- function ordering, as pragmatic as possible, order from high level to low level functions, so it reads nicely

### frontend scripts

- reference [rsjs - Reasonable System for JavaScript Structure](https://ricostacruz.com/rsjs/)
    - `data-js-scriptName` attribute on elements with `scriptName.ts` as the corresponding script for that attribute

## tailwind classes

- avoid margins as much as pragmatically possible

## docs

- docs that are written well and easy to read for humans are also easy to read for AI
- dont duplicate docs
    - eg. code architecture does not necessarily need to be written, if it is hard to understand the code architecture then its a problem with folder structuring and file naming
    - eg. concerns that are not trivially self-documented by the code should be written as comments near relevant code (kind-of Locality of Behaviour)
- docs rationale is that any human / agent can easily onboard and get productive instantly
- docs are often written by one person but read by many, respect the reader's time, longer is not better ([ref](https://x.com/NCResq/status/2087040147091308711))
