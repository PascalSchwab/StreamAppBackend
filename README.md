# StreamAppBackend
Backend for IRL-Streaming-App


```yaml
services:
  streamapp:
    container_name: streamapp
    image: ghcr.io/pascalschwab/streamappbackend:main
    ports:
      - "5000:5000"
    environment:
      - PASSWORD=test
      - CHANNEL_NAME=name
      - ACCESS_TOKEN=12345
      - CLIENT_ID=1234
      - MAX_HISTORY=3
      - STREAM_ELEMENTS_TOKEN=1234
      - STREAM_ELEMENTS_ID=1234
```
