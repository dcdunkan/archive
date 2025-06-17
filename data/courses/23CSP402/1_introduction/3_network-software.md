# Network Software

## Protocol Hierarchies

- To reduce the design complexity, most networks are organized as a stack of layers or levels, each one built upon the one below it.
- The number of layers, the name of each layer, the contents of each layer, and the function of each layer differ from network to network.
- The purpose of each layer is to offer certain services to the higher layers, shielding those layers from the details of how the offered services are actually implemented.
- Each layer is a kind of virtual machine, offering certain services to the layer above it
- Layer N on one machine carries on a conversation with layer N on another machine. The rules and conventions used in this conversation are collectively known as the layer N protocol.
- Basically, a protocol is an agreement between the communicating parties on how communication is to proceed.
- In reality, no data are directly transferred from layer N on one machine to layer N on another machine.
- Instead, each layer passes data and control information to the layer immediately below it, until the lowest layer is reached.
- Below layer 1 is the physical medium through which actual communication occurs.

Layers, protocols, and interfaces

Example information flow supporting virtual communication in layer 5

- A message, M, is produced by an application process running in layer 5 and given to layer 4 for transmission.
- Layer 4 puts a header in front of the message to identify the message and passes the result to layer 3. The header includes control information(sequence numbers) to allow layer 4 on the destination machine to deliver messages in the right order if the Iower layers do not maintain sequence.
- In some layers, headers can also contain sizes, times, and other control fields.
- Layer 3 must break up the incoming messages into smaller units, packets, prepending a layer 3 header to each packet
- Layer 2 adds not only a header to each piece, but also a trailer, and gives the resulting unit to layer 1 for physical transmission.
- At the receiving machine the message moves upward, from layer to Iayer, with headers being stripped off as it progresses.

## Design Issues for the Layers

- Every layer needs a mechanism for identifying senders and receivers. Some form of addressing is needed in order to specify a specific destination
- The rules for data transfer- In some systems, data only travel in one direction; in others, data can go both ways.
- Error control is an important issue because physical communication circuits are not perfect. Many error-detecting and error-correcting codes are known, but both ends of the connection must agree on which one is being used. In addition, the receiver must have some way of telling the sender which messages have been correctly received and which have not.
- Not all communication channels preserve the order of messages sent on them. To deal with a possible loss of sequencing, the protocol must make explicit provision for the receiver to allow the pieces to be reassembled properly
- An issue that occurs at every level is how to keep a fast sender from swamping a slow receiver with data.
- Another problem that must be solved at several levels is the inability of all processes to accept arbitrarily long messages. This property leads to mechanisms for disassembling, transmitting, and then reassembling messages.
- When there are multiple paths between source and destination, a route must be chosen. Sometimes this decision must be split over two or more layers (Routing)

## Connection-Oriented Service

- To use a connection-oriented network service, the service user first establishes a connection, uses the connection, and then releases the connection (Eg: telephone system)
- In most cases the order is preserved so that the bits arrive in the order they were sent.
- The source first makes a connection with the destination before sending a packet. When the connection is established, a sequence of packets from the same source to the same destination can be sent one after another.
- In this case, there is a relationship between packets. They are sent on the same path in sequential order.
- A packet is logically connected to the packet traveling before it and to the packet traveling after it.
- When all packets of a message have been delivered, the connection is terminated.

## Connectionless Service

- In connectionless service, the network layer protocol treats each packet independently, with each packet having no relationship to any other packet.
- The packets in a message may or may not travel the same path to their destination.
- The Internet has chosen this type of service at the network layer.

## Protocols

A protocol is a set of rules that govern data communications. A protocol defines what is communicated, how it is communicated, and when it is communicated. The key elements of a protocol are syntax, semantics, and timing.

- Syntax - The term syntax refers to the structure or format of the data, meaning the order in which they are presented
- Semantics - The word semantics refers to the meaning of each section of bits
- Timing - The term timing refers to two characteristics: when data should be sent and how fast they can be sent
