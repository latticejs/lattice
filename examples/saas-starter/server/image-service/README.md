# Image Manager Service.

A node.js service that is used to upload images to the s3 or other compatible storage systems.


# Installation and Setup.

Run `npm install` to install the required dependencies.
Edit the **config.js** and add your s3 configuration here or create a **.env** file at the root of the project and place the environment variables in there, using the **.env-sample** file as a reference.


# Starting the service. 
Run `npm run start` to start the service and `npm run dev` to start the app in development mode with hot reload.
