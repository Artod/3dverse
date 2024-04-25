# 3D File Transformation Server

This project is a simple Express server written in TypeScript that provides API endpoints for managing and transforming 3D files. It allows for operations such as listing, uploading, downloading, renaming, deleting, and specifically transforming 3D files based on scale and translation vectors.

## Setup and Installation

### Prerequisites

Ensure you have Node.js and npm installed on your system. You can download and install them from [nodejs.org](https://nodejs.org/).

### Installing Dependencies

To set up the project and install the required dependencies, follow these steps:

1. Clone the repository or download the source code.
2. Navigate to the root directory of the project via the command line.
3. Run the following command to install all necessary dependencies:

```bash
npm install
```

This will install Express and any other libraries listed in the package.json file.

## Running the Server
To start the server, run:

```bash
npm run start
```

This command will compile the TypeScript files and start the server on http://localhost:3000. 

## Testing the API
To test the functionality of the API, you can use the following requests. These can be made using a browser (for GET requests) or a tool like Postman or curl for more complex operations.

1. Transform and Download a File
To test the transformation and download of a larger file, use the following URL in your browser or HTTP client:

    ```bash
    http://localhost:3000/files/transform/buggy.obj?scale=[-1,1,1]&translate=[0,1,0]
    ```
    This request will apply a transformation to the `buggy.obj` **(not included in the repo!)** file using the specified scale and translation vectors and prompt a download of the transformed file.

2. Test Without Download
For a simpler test that does not trigger a file download and returns plain text in the browser, you can use the undocumented plain parameter:

    ```bash
    http://localhost:3000/files/transform/buggy-small.obj?scale=[-1,1,1]&translate=[0,1,0]&plain=1
    ```

    This request will perform the same transformations on a smaller file and display the result as plain text directly in the browser window. This is useful for debugging or development purposes where downloading a file might be cumbersome.

## Notes
- The plain parameter is for development/testing purposes and should not be used in production environments.
- Ensure that the file paths and names correspond to actual files on your server to avoid errors.
- The server and all routes are designed to handle basic 3D file operations and transformations. Be sure to handle errors and edge cases as needed in a production environment.