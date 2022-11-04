FROM nginx
LABEL maintainer="ahriknow ahriknow@ahriknow.cn"
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
ENTRYPOINT ["/bin/bash", "-c", "sed -i \"s@VITE_BASE_URL_HTTP@\"$BASE_URL\"@\" /usr/share/nginx/html/env.json; nginx -g \"daemon off;\""]
