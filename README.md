## AHRIPOST - WEB

### Build Docker Image

1. Change `VITE_BASE_URL_HTTP` in `.env` to your domain path.
2. Edit `nginx.conf` in the project root directory.
3. Execute `./build.sh image_name:version` to build the image.

### Run Docker Container

```bash
docker run -p 80:80 -d --name name image_name:version
```
