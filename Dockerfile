FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# For Lambda
# ENTRYPOINT [ "/lambda-entrypoint.sh" ]
# CMD [ "src/handlers/dsa/run.handler" ]

# For Local
EXPOSE 4000
CMD ["npm", "start"]
