# Web Server

## Description

The web server presents a simple API for publishing messages to a queue.

## API 

### <QUEUE_NAME>

The web server publishes the message given to the requested queue, if said queue is configured.
Requests to this API are of the form:

`http://localhost:3000/<QUEUE_NAME>?message=<MESSAGE>`
  
Where:
 - QUEUE_NAME is the name of the desired queue (which must be configured)
 - MESSAGE is the desired message (cannot be empty)

## Configuration 

The web server is passed several environment variables that define its behavior:
 - the `QUEUE_TYPE` environment variable sets the type of queue the web server publishes messages to.
 - the `RABBITMQ_QUEUE_URL` environment variable sets the address of a RabbitMQ instance to publish messages to in case a RabbitMQ queue is used.

## Supported Queue Types

### RabbitMQ

This queue type is supported via the Rascal library, and the relevant configuration is found in the `config/rascal_config.json` file.

It is important to note:
 - the queue URL provided is intended for development purposes.
 - queues not listed under the 'queues' subsection are ineligible for message forwarding; in order to add an additional queue, it must be added in this subsection.


# Asynchronous Worker

## Description

The asynchronous worker is configured by a queue type and a role type, subscribes to a given queue matching its given queue type and role and processes incoming messages.

## Configuration

The worker is passed several environment variables that define its behavior:
 - the `QUEUE_TYPE` environment variable sets the type of queue the worker subscribes to receive messages from.
 - the `ROLE_TYPE` environment variable sets the role the worker instance fulfills; this also defines the queue name the worker subscribes to.
 - the `RABBITMQ_QUEUE_URL` environment variable sets the address of a RabbitMQ instance to subscribe to messages from in case a RabbitMQ queue is used.
 - the `MONGODB_URL` environment variable sets the address of a MongoDB instance for use in subscription handling.

## Supported Queue Types

### RabbitMQ

This queue type is supported via the Rascal library, and the relevant configuration is found in the `config/rascal_config.json` file.

It is important to note:
 - the queue URL provided is intended for development purposes.
 - queues not listed under the 'queues' subsection are ineligible for message forwarding; in order to add an additional queue, it must be added in this subsection.
 - roles not listed under the 'subscriptions' subsection will not subscribe to messages published to their respective queues; in order to add an additional role, it must be added in this subsection.

## Supported Role Types

### Email

This role type reads messages published to the 'email' queue and inserts them to a MongoDB instance.

# Setup

The project contains a `docker-compose.yml` file which describes a default setup of the application. To set the application up according to the file, on a machine with Docker-Compose configured, run `docker-compose build`, followed by `docker-compose up -d`.

The application becomes fully available after a few seconds as the database and queue take a while to become available- please be patient. :)

# Enabling Additional Functionality

## Enabling Additional Queue Types

In order to add an additional queue type, the following interfaces must be implemented:
 - `Publisher`: the interface defining how the web server publishes messages to the queue type.
 - `Subscriber`: the interface defining how the worker subscribes to messages from the queue type.

## Enabling Additional Role Types

In order to add an additional role type, the `RoleType` interface, which defines the execution method for incoming messages, must be implemented.
