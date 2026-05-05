From node:22
WORKDIR /src
COPY package.json ./
RUN yarn install
COPY . .
EXPOSE 3000
CMD ["node","yarn"]
