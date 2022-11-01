FROM nginx
LABEL maintainer="ahriknow ahriknow@ahriknow.cn"
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
