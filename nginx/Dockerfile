# Base on offical NGINX Alpine image
FROM nginx:alpine

# Remove any existing config files
RUN rm /etc/nginx/conf.d/*

# Copy config files
# *.conf files in conf.d/ dir get included in main config - update for localhost
COPY ./next.conf /etc/nginx/conf.d/

# Expose the listening port
EXPOSE 3000

# Launch NGINX
CMD [ "nginx", "-g", "daemon off;" ]