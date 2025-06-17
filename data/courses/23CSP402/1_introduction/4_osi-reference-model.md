# OSI Reference Model

- A network is a combination of hardware and software that sends data from one location to another.
- The hardware consists of the physical equipment that carries signals from one point of the network to another. The software consists of instruction sets that make possible the services that we expect from a network
- The OSI model is a layered framework for the design of network systems that allows communication between all types of computer systems
- It consists of seven separate but related layers

## Physical Layer

- The physical layer is concerned with transmitting raw bits over a communication channel
- The physical layer is responsible for movements of individual bits from one hop (node) to the next.

Other responsibilities:

1. Physical characteristics of interfaces and medium - defines the characteristics of the interface between the devices and the transmission medium. It also defines the type of transmission medium.
2. Representation of bits - To be transmitted, bits must be encoded into signals (electrical or optical). The physical layer defines the type of encoding (how Os and 1s are changed to signals).
3. Data rate (The transmission rate) - the number of bits sent each second is also defined by the physical layer
4. Synchronization of bits - the sender and the receiver clocks must be synchronized.
5. Line configuration - The physical layer is concerned with the connection of devices to the media. In a point-to-point configuration, two devices are connected through a dedicated link. In a multipoint configuration, a link is shared among several devices.
6. Physical topology - The physical topology defines how devices are connected to make a network. Devices can be connected by using a mesh topology ,a star topology ,a ring topology ,a bus topology or a hybrid topology
7. Transmission mode - The physical layer also defines the direction of transmission between two devices: simplex, half-duplex, or full-duplex.
   - In simplex mode, only one device can send; the other can only receive. The simplex mode is a one-way communication.
   - In the half-duplex mode, two devices can send and receive, but not at the same time.
   - In a full-duplex (or simply duplex) mode, two devices can send and receive at the same time.

## Data Link Layer

- The data link layer is responsible for moving frames from one hop (node) to the next

Other responsibilities:

1. Framing - The data link layer divides the stream of bits received from the network layer into manageable data units called frames
2. Physical addressing - If frames are to be distributed to different systems on the network, the data link layer adds a header to the frame to define the sender and/or receiver of the frame. If the frame is intended for a system outside the sender's network, the receiver address is the address of the device that connects the network to the next one.
3. Flow control - If the rate at which the data are absorbed by the receiver is less than the rate at which data are produced in the sender, the data link layer imposes a flow control mechanism to avoid overwhelming the receiver.
4. Error control - The data link layer adds reliability to the physical layer by adding mechanisms to detect and retransmit damaged or Iost frames. It also uses a mechanism to recognize duplicate frames. Error control is normally achieved through a trailer added to the end of the frame
5. Access control - When two or more devices are connected to the same link, data link layer protocols are necessary to determine which device has control over the link at any given time.

## Network Layer

- The network layer is responsible for the delivery of individual packets from the source host to the destination host
- If two systems are connected to the same link, there is usually no need for a network layer.
- If the two systems are attached to different networks (links) with connecting devices between the networks (links), there is often a need for the network layer to accomplish source-to-destination delivery

Other responsibilities:

1. Logical addressing - The physical addressing implemented by the data link layer handles the addressing problem locally. If a packet passes the network boundary, we need another addressing system to help distinguish the source and destination systems. The network layer adds a header to the packet coming from the upper layer that, among other things, includes the logical addresses of the sender and receiver
2. Routing - When independent networks or links are connected to create internetworks (network of networks) or a large network, the connecting devices (called routers or switches) route or switch the packets to their final destination

## Transport Layer

- The transport layer is responsible for process-to-process delivery of the entire message
- The transport layer is responsible for the delivery of a message from one process to another . A process is an application program running on a host.

Other responsibilities:

1. Service-point addressing - delivery of message not only from one computer to the next but also from a specific process (running program) on one computer to a specific process (running program) on the other. The transport layer header must therefore include a type of address called a service-point address (or port address).
   - The network layer gets each packet to the correct computer; the transport layer gets the entire message to the correct process on that computer.
2. Segmentation and reassembly - A message is divided into transmittable segments, with each segment containing a sequence number. These numbers enable the transport layer to reassemble the message correctly upon arriving at the destination.
3. Connection control - The transport layer can be either connectionless or connection oriented.
4. Flow control - The transport layer is responsible for flow control. However, flow control at this layer is performed end to end rather than across a single link
5. Error control - Like the data link layer, the transport layer is responsible for error control. However, error control at this layer is performed process-to process rather than across a single link.

- The sending transport layer makes sure that the entire message arrives at the receiving transport layer without error (damage, loss, or duplication).
- Error correction is usually achieved through retransmission.

## Session Layer

The session layer is responsible for dialog control and synchronization.

Specific responsibilities:

1. Dialog control - The session layer allows two systems to enter into a dialog. It allows the communication between two processes to take place in either half duplex (one way at a time) or full-duplex (two ways at a time) mode.
2. Synchronization - The session layer allows a process to add checkpoints, or synchronization points, to a stream of data

## Presentation Layer

The presentation layer is concerned with the syntax and semantics of the information exchanged between two systems

Specific responsibilities:

1. Translation - Because different computers use different encoding systems, the presentation layer is responsible for interoperability between these different encoding methods. The presentation Iayer at the sender changes the information from its senderdependent format into a common format. The presentation layer at the receiving machine changes the common format into its receiver-dependent format
2. Encryption - To carry sensitive information, a system must be able to ensure privacy. Encryption means that the sender transforms the original information to another form and sends the resulting message out over the network. Decryption reverses the original process to transform the message back to its original form
3. Compression - Data compression reduces the number of bits contained in the information. Data compression becomes particularly important in the transmission of multimedia such as text, audio, and video

## Application Layer

- The application layer is responsible for providing services to the user.
- It provides user interfaces and support for services such as electronic mail, remote file access and transfer, shared database management, and other types of distributed information services

Other responsibilities:

1. Network Virtual Terminal (NvT) - A network virtual terminal is a software version of a physical terminal, and it allows a user to log on to a remote host. The remote host believes it is communicating with one of its own terminals and allows the user to log on.
2. File transfer, access, and management - This application allows a user to access files in a remote host (to make changes or read data), to retrieve files from a remote computer for use in the local computer, and to manage or control files in a remote computer locally
3. Mail services - This application provides the basis for e-mail forwarding and storage.
4. Directory services - This application provides distributed database sources and access for global information about various objects and services.
