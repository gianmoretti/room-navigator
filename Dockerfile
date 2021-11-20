FROM node

# Create app directory
RUN mkdir -p /mnt
WORKDIR /mnt

# Install app dependencies
COPY package.json /mnt
RUN npm i

# Bundle app source
COPY tsconfig.json /mnt
COPY src /mnt/src
COPY test /mnt/test

# Bundle app script
COPY scripts /mnt/scripts
RUN ["chmod", "+x", "/mnt/scripts/build.sh"]
RUN ["chmod", "+x", "/mnt/scripts/tests.sh"]
RUN ["chmod", "+x", "/mnt/scripts/run.sh"]
EXPOSE 9090
