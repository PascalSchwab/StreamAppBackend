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
      - TWITCH_CHANNEL_NAME=name
      - TWITCH_CLIENT_ID=1234
      - TWITCH_ACCESS_TOKEN=1234
      - TWITCH_REFRESH_TOKEN=1234
      - TWITCH_BROADCASTER_ID=1234
      - MAX_HISTORY=3
      - STREAM_ELEMENTS_TOKEN=1234
      - STREAM_ELEMENTS_ID=1234
```
