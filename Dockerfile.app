FROM node:18-alpine as builder
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY app /app
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm i -force

RUN echo "fs.inotify.max_user_watches=524288" >> /etc/sysctl.conf

RUN npx update-browserslist-db@latest

#ENV REACT_APP_ENV=test
#ENV ENV=testing

#RUN npm run build:${ENV}

#RUN npm install --force -g serve

#CMD serve -s build

CMD npm run build:${ENV} && npm install --force -g serve && serve -s build
#CMD npm run start:$ENV
