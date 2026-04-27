FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/elamram.conf

# Copy website files
COPY . /usr/share/nginx/html/

EXPOSE 8092

CMD ["nginx", "-g", "daemon off;"]
