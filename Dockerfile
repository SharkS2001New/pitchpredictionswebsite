# base image
FROM alpine

# create & set working directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

# copy source files
COPY . /usr/src

# install dependencies and build app
RUN apk add --no-cache nodejs npm && \
    npm install && \
    npm run build && \
    npm uninstall -g npm && \
    apk del nodejs && \
    rm -rf /root/.npm

# expose port and start app
EXPOSE 3000
CMD ["npm", "start"]
