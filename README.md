# WebCourt

## Python (Windows)
* python version 3.11.7, but 3.10 should work as well
* `python -m venv .venv`
* `pipenv install`
* `.\.venv\Scripts\activate`
* <details>
    <summary>some packages version</summary>

    - ultralytics 8.2.2 prompt warning that tensorflow should <=2.13.1 when converting to tfjs

    - tensorflow-decision-forests 1.8.1 works when converting to tfjs, otherwise there is an error about the decision forests' inference.so not found
  </details>
