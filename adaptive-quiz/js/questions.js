/**
 * Question bank organized by topic and difficulty (Easy / Medium / Hard).
 * Each item includes an IRT-style difficulty parameter (b) for adaptive selection.
 */
window.QUESTION_BANK = [
  {
    "id": "wd-e-1",
    "topic": "Web Development",
    "difficulty": "Easy",
    "b": -1.1,
    "question": "Which HTML tag creates a hyperlink?",
    "options": [
      "<link>",
      "<a>",
      "<href>",
      "<url>"
    ],
    "answer": 1,
    "explanation": "The <a> (anchor) tag creates a hyperlink. The destination is set with the href attribute."
  },
  {
    "id": "wd-e-2",
    "topic": "Web Development",
    "difficulty": "Easy",
    "b": -1.0,
    "question": "Which CSS property changes the text color of an element?",
    "options": [
      "font-color",
      "text-style",
      "color",
      "foreground"
    ],
    "answer": 2,
    "explanation": "The color property sets the foreground text color. font-color is not a valid CSS property."
  },
  {
    "id": "wd-e-3",
    "topic": "Web Development",
    "difficulty": "Easy",
    "b": -0.9,
    "question": "Which keyword declares a block-scoped variable in modern JavaScript?",
    "options": [
      "var",
      "let",
      "define",
      "static"
    ],
    "answer": 1,
    "explanation": "let (and const) are block-scoped. var is function-scoped and is generally avoided in ES6+ code."
  },
  {
    "id": "wd-e-4",
    "topic": "Web Development",
    "difficulty": "Easy",
    "b": -1.2,
    "question": "What does CSS stand for?",
    "options": [
      "Computer Style Syntax",
      "Cascading Style Sheets",
      "Creative Screen System",
      "Coded Style Script"
    ],
    "answer": 1,
    "explanation": "CSS stands for Cascading Style Sheets, the language used to style HTML documents."
  },
  {
    "id": "wd-m-1",
    "topic": "Web Development",
    "difficulty": "Medium",
    "b": -0.1,
    "question": "Which HTTP status code means a resource was not found?",
    "options": [
      "200",
      "301",
      "404",
      "500"
    ],
    "answer": 2,
    "explanation": "404 Not Found means the server could not find the requested resource. 500 is a server error."
  },
  {
    "id": "wd-m-2",
    "topic": "Web Development",
    "difficulty": "Medium",
    "b": 0.1,
    "question": "What does localStorage persist across?",
    "options": [
      "Only the current tab session",
      "Browser restarts until the user clears it",
      "Only until the page is refreshed",
      "Only private/incognito windows"
    ],
    "answer": 1,
    "explanation": "localStorage stores key-value data with no expiry. It remains after refresh and browser restart unless cleared."
  },
  {
    "id": "wd-m-3",
    "topic": "Web Development",
    "difficulty": "Medium",
    "b": 0.0,
    "question": "Which array method returns a new array of transformed items without changing the original?",
    "options": [
      "forEach",
      "push",
      "map",
      "splice"
    ],
    "answer": 2,
    "explanation": "map creates a new array by applying a function to each element. splice mutates the original array."
  },
  {
    "id": "wd-m-4",
    "topic": "Web Development",
    "difficulty": "Medium",
    "b": 0.2,
    "question": "What is the default positioning of an HTML element?",
    "options": [
      "absolute",
      "fixed",
      "relative",
      "static"
    ],
    "answer": 3,
    "explanation": "The default CSS position is static, which follows normal document flow."
  },
  {
    "id": "wd-h-1",
    "topic": "Web Development",
    "difficulty": "Hard",
    "b": 1.0,
    "question": "In the CSS box model, which property is excluded from width when box-sizing is content-box?",
    "options": [
      "content width",
      "padding and border",
      "font size",
      "line height"
    ],
    "answer": 1,
    "explanation": "With content-box (the default), width applies only to content. Padding and border are added outside that width."
  },
  {
    "id": "wd-h-2",
    "topic": "Web Development",
    "difficulty": "Hard",
    "b": 1.1,
    "question": "What does event.preventDefault() do in the DOM?",
    "options": [
      "Stops the event from bubbling",
      "Cancels the browser's default action for that event",
      "Removes the event listener",
      "Pauses JavaScript execution"
    ],
    "answer": 1,
    "explanation": "preventDefault cancels the built-in action (for example, form submit or link navigation). stopPropagation handles bubbling."
  },
  {
    "id": "wd-h-3",
    "topic": "Web Development",
    "difficulty": "Hard",
    "b": 1.2,
    "question": "Which statement about const objects in JavaScript is correct?",
    "options": [
      "The object cannot be mutated at all",
      "The binding cannot be reassigned, but object properties can still change",
      "const only works with numbers",
      "const freezes nested objects automatically"
    ],
    "answer": 1,
    "explanation": "const prevents reassignment of the variable. Object properties remain mutable unless Object.freeze is used."
  },
  {
    "id": "wd-h-4",
    "topic": "Web Development",
    "difficulty": "Hard",
    "b": 0.9,
    "question": "Which storage API is cleared when the browser tab is closed?",
    "options": [
      "localStorage",
      "IndexedDB",
      "sessionStorage",
      "Cache Storage"
    ],
    "answer": 2,
    "explanation": "sessionStorage lasts for the page session and is cleared when the tab is closed. localStorage persists."
  },
  {
    "id": "ds-e-1",
    "topic": "Data Structures",
    "difficulty": "Easy",
    "b": -1.1,
    "question": "Which data structure follows FIFO (First In, First Out)?",
    "options": [
      "Stack",
      "Queue",
      "Tree",
      "Graph"
    ],
    "answer": 1,
    "explanation": "A queue removes items in the order they were added (FIFO). A stack uses LIFO."
  },
  {
    "id": "ds-e-2",
    "topic": "Data Structures",
    "difficulty": "Easy",
    "b": -1.0,
    "question": "Which data structure uses LIFO (Last In, First Out)?",
    "options": [
      "Queue",
      "Array only",
      "Stack",
      "Linked list only"
    ],
    "answer": 2,
    "explanation": "A stack pops the most recently pushed item first, which is LIFO."
  },
  {
    "id": "ds-e-3",
    "topic": "Data Structures",
    "difficulty": "Easy",
    "b": -0.9,
    "question": "What is the time complexity of accessing an element by index in an array?",
    "options": [
      "O(n)",
      "O(log n)",
      "O(1)",
      "O(n log n)"
    ],
    "answer": 2,
    "explanation": "Array index access is constant time because the address can be computed directly from the index."
  },
  {
    "id": "ds-e-4",
    "topic": "Data Structures",
    "difficulty": "Easy",
    "b": -1.2,
    "question": "A binary tree node can have at most how many children?",
    "options": [
      "1",
      "2",
      "3",
      "Unlimited"
    ],
    "answer": 1,
    "explanation": "By definition, each node in a binary tree has at most two children: left and right."
  },
  {
    "id": "ds-m-1",
    "topic": "Data Structures",
    "difficulty": "Medium",
    "b": 0.0,
    "question": "Which traversal visits a binary tree in Left, Root, Right order?",
    "options": [
      "Preorder",
      "Inorder",
      "Postorder",
      "Level order"
    ],
    "answer": 1,
    "explanation": "Inorder traversal visits the left subtree, then the root, then the right subtree."
  },
  {
    "id": "ds-m-2",
    "topic": "Data Structures",
    "difficulty": "Medium",
    "b": 0.2,
    "question": "What is the average-case time complexity of search in a balanced BST?",
    "options": [
      "O(1)",
      "O(n)",
      "O(log n)",
      "O(n²)"
    ],
    "answer": 2,
    "explanation": "A balanced binary search tree halves the search space at each step, giving O(log n) average search time."
  },
  {
    "id": "ds-m-3",
    "topic": "Data Structures",
    "difficulty": "Medium",
    "b": -0.1,
    "question": "Which structure is best for implementing undo in an editor?",
    "options": [
      "Queue",
      "Stack",
      "Hash table",
      "Heap"
    ],
    "answer": 1,
    "explanation": "Undo reverses the most recent action first, which maps naturally to a stack."
  },
  {
    "id": "ds-m-4",
    "topic": "Data Structures",
    "difficulty": "Medium",
    "b": 0.1,
    "question": "A hash table's expected lookup time with a good hash function is:",
    "options": [
      "O(n)",
      "O(log n)",
      "O(1)",
      "O(n log n)"
    ],
    "answer": 2,
    "explanation": "With uniform hashing and a reasonable load factor, expected lookup, insert, and delete are O(1)."
  },
  {
    "id": "ds-h-1",
    "topic": "Data Structures",
    "difficulty": "Hard",
    "b": 1.1,
    "question": "Which collision-resolution method stores colliding keys in a linked list at the same bucket?",
    "options": [
      "Linear probing",
      "Quadratic probing",
      "Chaining",
      "Double hashing"
    ],
    "answer": 2,
    "explanation": "Separate chaining places colliding items in a list (or another structure) at the hashed index."
  },
  {
    "id": "ds-h-2",
    "topic": "Data Structures",
    "difficulty": "Hard",
    "b": 1.0,
    "question": "Dijkstra's algorithm is typically implemented with which priority structure?",
    "options": [
      "Stack",
      "Min-heap / priority queue",
      "Queue only",
      "AVL tree of edges"
    ],
    "answer": 1,
    "explanation": "Dijkstra repeatedly extracts the closest unsettled vertex, which a min-heap/priority queue supports efficiently."
  },
  {
    "id": "ds-h-3",
    "topic": "Data Structures",
    "difficulty": "Hard",
    "b": 1.2,
    "question": "What is the worst-case time complexity of QuickSort?",
    "options": [
      "O(n log n)",
      "O(n)",
      "O(n²)",
      "O(log n)"
    ],
    "answer": 2,
    "explanation": "If pivots are consistently poor (for example already sorted data with a naive pivot), QuickSort degrades to O(n²)."
  },
  {
    "id": "ds-h-4",
    "topic": "Data Structures",
    "difficulty": "Hard",
    "b": 0.9,
    "question": "In a max-heap, the largest element is always located:",
    "options": [
      "At a random leaf",
      "At the root",
      "At the leftmost child",
      "In the middle level"
    ],
    "answer": 1,
    "explanation": "A max-heap maintains the heap property that every parent is greater than or equal to its children, so the root is maximum."
  },
  {
    "id": "db-e-1",
    "topic": "Database Systems",
    "difficulty": "Easy",
    "b": -1.1,
    "question": "SQL is primarily used to:",
    "options": [
      "Style web pages",
      "Query and manage relational databases",
      "Compile C programs",
      "Draw charts"
    ],
    "answer": 1,
    "explanation": "SQL (Structured Query Language) is the standard language for relational database queries and updates."
  },
  {
    "id": "db-e-2",
    "topic": "Database Systems",
    "difficulty": "Easy",
    "b": -1.0,
    "question": "Which SQL command retrieves rows from a table?",
    "options": [
      "GET",
      "SELECT",
      "FETCH TABLE",
      "SHOW ROWS"
    ],
    "answer": 1,
    "explanation": "SELECT is the SQL command used to read data from one or more tables."
  },
  {
    "id": "db-e-3",
    "topic": "Database Systems",
    "difficulty": "Easy",
    "b": -0.9,
    "question": "A primary key must be:",
    "options": [
      "Nullable and duplicated",
      "Unique and not null",
      "Only numeric",
      "Stored in a separate database"
    ],
    "answer": 1,
    "explanation": "A primary key uniquely identifies each row and cannot contain NULL values."
  },
  {
    "id": "db-e-4",
    "topic": "Database Systems",
    "difficulty": "Easy",
    "b": -1.2,
    "question": "Which clause filters rows in a SQL query?",
    "options": [
      "ORDER BY",
      "GROUP BY",
      "WHERE",
      "HAVING only for all queries"
    ],
    "answer": 2,
    "explanation": "WHERE filters individual rows before grouping. HAVING filters groups after GROUP BY."
  },
  {
    "id": "db-m-1",
    "topic": "Database Systems",
    "difficulty": "Medium",
    "b": 0.0,
    "question": "A foreign key is used to:",
    "options": [
      "Encrypt a column",
      "Enforce a relationship to another table's key",
      "Sort query results",
      "Create an index automatically on every column"
    ],
    "answer": 1,
    "explanation": "A foreign key references a primary (or unique) key in another table and enforces referential integrity."
  },
  {
    "id": "db-m-2",
    "topic": "Database Systems",
    "difficulty": "Medium",
    "b": 0.1,
    "question": "Which normal form removes repeating groups / multi-valued attributes?",
    "options": [
      "1NF",
      "2NF",
      "3NF",
      "BCNF only"
    ],
    "answer": 0,
    "explanation": "First Normal Form requires atomic values and no repeating groups in a relation."
  },
  {
    "id": "db-m-3",
    "topic": "Database Systems",
    "difficulty": "Medium",
    "b": -0.1,
    "question": "INNER JOIN returns:",
    "options": [
      "All rows from both tables",
      "Only matching rows from both tables",
      "Only unmatched left rows",
      "A Cartesian product always"
    ],
    "answer": 1,
    "explanation": "INNER JOIN keeps rows where the join condition matches in both tables."
  },
  {
    "id": "db-m-4",
    "topic": "Database Systems",
    "difficulty": "Medium",
    "b": 0.2,
    "question": "ACID's Isolation property means:",
    "options": [
      "Data is never deleted",
      "Concurrent transactions do not interfere incorrectly",
      "The database has no users",
      "Queries cannot fail"
    ],
    "answer": 1,
    "explanation": "Isolation ensures concurrent transactions behave as if they ran without harmful interference."
  },
  {
    "id": "db-h-1",
    "topic": "Database Systems",
    "difficulty": "Hard",
    "b": 1.0,
    "question": "Which index type is typically best for range queries on ordered keys?",
    "options": [
      "Hash index",
      "B+ tree index",
      "Bitmap only on unique IDs",
      "Full table scan"
    ],
    "answer": 1,
    "explanation": "B+ trees keep keys in sorted order, so range scans (BETWEEN, <, >) are efficient. Hash indexes suit equality lookups."
  },
  {
    "id": "db-h-2",
    "topic": "Database Systems",
    "difficulty": "Hard",
    "b": 1.2,
    "question": "A relation is in 3NF if it is in 2NF and:",
    "options": [
      "Every attribute is a key",
      "No non-prime attribute is transitively dependent on a candidate key",
      "It has no foreign keys",
      "All attributes are numeric"
    ],
    "answer": 1,
    "explanation": "3NF forbids transitive dependencies of non-prime attributes on candidate keys."
  },
  {
    "id": "db-h-3",
    "topic": "Database Systems",
    "difficulty": "Hard",
    "b": 1.1,
    "question": "In two-phase locking, a transaction cannot:",
    "options": [
      "Read data",
      "Acquire any lock after it has released a lock",
      "Commit",
      "Use shared locks"
    ],
    "answer": 1,
    "explanation": "Two-phase locking has a growing phase then a shrinking phase. After the first unlock, no new locks may be acquired."
  },
  {
    "id": "db-h-4",
    "topic": "Database Systems",
    "difficulty": "Hard",
    "b": 0.9,
    "question": "Which SQL aggregate is used with GROUP BY to count rows per group?",
    "options": [
      "COUNT",
      "INDEX",
      "UNIQUE",
      "CAST"
    ],
    "answer": 0,
    "explanation": "COUNT returns the number of rows in each group produced by GROUP BY."
  },
  {
    "id": "os-e-1",
    "topic": "Operating Systems",
    "difficulty": "Easy",
    "b": -1.1,
    "question": "An operating system is mainly responsible for:",
    "options": [
      "Only compiling programs",
      "Managing hardware and providing services to programs",
      "Designing websites",
      "Sending physical mail"
    ],
    "answer": 1,
    "explanation": "An OS manages CPU, memory, storage, and devices, and offers system services to applications."
  },
  {
    "id": "os-e-2",
    "topic": "Operating Systems",
    "difficulty": "Easy",
    "b": -1.0,
    "question": "RAM is an example of:",
    "options": [
      "Secondary storage only",
      "Primary / main memory",
      "A CPU register file exclusively",
      "A network protocol"
    ],
    "answer": 1,
    "explanation": "RAM is volatile main memory used to hold running programs and data."
  },
  {
    "id": "os-e-3",
    "topic": "Operating Systems",
    "difficulty": "Easy",
    "b": -0.9,
    "question": "Which of the following is a process state?",
    "options": [
      "Compiled",
      "Ready",
      "Indexed",
      "Normalized"
    ],
    "answer": 1,
    "explanation": "Common process states include new, ready, running, waiting/blocked, and terminated."
  },
  {
    "id": "os-e-4",
    "topic": "Operating Systems",
    "difficulty": "Easy",
    "b": -1.2,
    "question": "A deadlock can occur when processes:",
    "options": [
      "Never request resources",
      "Wait forever for resources held by each other",
      "Run on a single core only",
      "Use only read-only files"
    ],
    "answer": 1,
    "explanation": "Deadlock is a circular wait where processes hold resources and wait for each other indefinitely."
  },
  {
    "id": "os-m-1",
    "topic": "Operating Systems",
    "difficulty": "Medium",
    "b": 0.0,
    "question": "Which scheduling algorithm can cause starvation of long jobs?",
    "options": [
      "FCFS",
      "Shortest Job First",
      "Round Robin with fair quanta",
      "None of these can starve"
    ],
    "answer": 1,
    "explanation": "SJF always prefers shorter jobs, so a continuous stream of short jobs can starve a long one."
  },
  {
    "id": "os-m-2",
    "topic": "Operating Systems",
    "difficulty": "Medium",
    "b": 0.1,
    "question": "Virtual memory allows a process to:",
    "options": [
      "Use more address space than physical RAM via paging/swapping",
      "Avoid using a CPU",
      "Disable interrupts forever",
      "Run without an OS"
    ],
    "answer": 0,
    "explanation": "Virtual memory maps virtual addresses to physical frames and can swap pages to disk."
  },
  {
    "id": "os-m-3",
    "topic": "Operating Systems",
    "difficulty": "Medium",
    "b": -0.1,
    "question": "A context switch is the act of:",
    "options": [
      "Compiling source code",
      "Saving and restoring CPU state to change the running process",
      "Formatting a disk",
      "Closing a browser tab"
    ],
    "answer": 1,
    "explanation": "The OS saves the current process's registers and loads another process's state during a context switch."
  },
  {
    "id": "os-m-4",
    "topic": "Operating Systems",
    "difficulty": "Medium",
    "b": 0.2,
    "question": "Which page replacement algorithm replaces the page unused for the longest time?",
    "options": [
      "FIFO",
      "LRU",
      "Random",
      "SSTF"
    ],
    "answer": 1,
    "explanation": "Least Recently Used (LRU) evicts the page whose last access is farthest in the past."
  },
  {
    "id": "os-h-1",
    "topic": "Operating Systems",
    "difficulty": "Hard",
    "b": 1.1,
    "question": "Which condition is NOT required for deadlock?",
    "options": [
      "Mutual exclusion",
      "Hold and wait",
      "Preemption of all resources at all times",
      "Circular wait"
    ],
    "answer": 2,
    "explanation": "Coffman conditions are mutual exclusion, hold and wait, no preemption, and circular wait. Continuous preemption prevents deadlock."
  },
  {
    "id": "os-h-2",
    "topic": "Operating Systems",
    "difficulty": "Hard",
    "b": 1.0,
    "question": "Thrashing in a virtual memory system means:",
    "options": [
      "The CPU is idle with no processes",
      "Excessive paging leaves little time for useful work",
      "The disk is defragmented",
      "All pages are locked in RAM"
    ],
    "answer": 1,
    "explanation": "Thrashing happens when the working set does not fit in memory, so the system spends most of its time paging."
  },
  {
    "id": "os-h-3",
    "topic": "Operating Systems",
    "difficulty": "Hard",
    "b": 1.2,
    "question": "A semaphore used for mutual exclusion is typically initialized to:",
    "options": [
      "-1",
      "0",
      "1",
      "The number of CPUs always"
    ],
    "answer": 2,
    "explanation": "A binary/mutex semaphore starts at 1 so the first wait/P succeeds and later waiters block until a signal/V."
  },
  {
    "id": "os-h-4",
    "topic": "Operating Systems",
    "difficulty": "Hard",
    "b": 0.9,
    "question": "In Round Robin scheduling, the time quantum primarily affects:",
    "options": [
      "Disk rotational delay",
      "Response time and context-switch overhead",
      "File system block size",
      "MAC addresses"
    ],
    "answer": 1,
    "explanation": "A small quantum improves interactivity but increases context switches; a large quantum approaches FCFS behavior."
  },
  {
    "id": "cn-e-1",
    "topic": "Computer Networks",
    "difficulty": "Easy",
    "b": -1.1,
    "question": "IP is primarily a protocol of which layer in the TCP/IP model?",
    "options": [
      "Application",
      "Transport",
      "Internet / Network",
      "Physical"
    ],
    "answer": 2,
    "explanation": "The Internet Protocol operates at the internet (network) layer and handles addressing and routing."
  },
  {
    "id": "cn-e-2",
    "topic": "Computer Networks",
    "difficulty": "Easy",
    "b": -1.0,
    "question": "Which device forwards packets between different networks?",
    "options": [
      "Hub",
      "Repeater",
      "Router",
      "Monitor"
    ],
    "answer": 2,
    "explanation": "A router forwards packets based on IP addresses and connects different networks."
  },
  {
    "id": "cn-e-3",
    "topic": "Computer Networks",
    "difficulty": "Easy",
    "b": -0.9,
    "question": "HTTP is commonly used to:",
    "options": [
      "Transfer web pages",
      "Assign MAC addresses",
      "Encrypt hard disks",
      "Schedule CPU jobs"
    ],
    "answer": 0,
    "explanation": "HTTP is the application protocol used by browsers and servers to transfer web resources."
  },
  {
    "id": "cn-e-4",
    "topic": "Computer Networks",
    "difficulty": "Easy",
    "b": -1.2,
    "question": "IPv4 addresses are how many bits long?",
    "options": [
      "16",
      "32",
      "64",
      "128"
    ],
    "answer": 1,
    "explanation": "IPv4 uses 32-bit addresses. IPv6 uses 128-bit addresses."
  },
  {
    "id": "cn-m-1",
    "topic": "Computer Networks",
    "difficulty": "Medium",
    "b": 0.0,
    "question": "TCP differs from UDP because TCP:",
    "options": [
      "Is connection-oriented and provides reliable delivery",
      "Cannot use ports",
      "Works only on wireless networks",
      "Does not use checksums"
    ],
    "answer": 0,
    "explanation": "TCP establishes a connection and offers reliability, ordering, and congestion control. UDP is connectionless."
  },
  {
    "id": "cn-m-2",
    "topic": "Computer Networks",
    "difficulty": "Medium",
    "b": 0.1,
    "question": "DNS is used to:",
    "options": [
      "Encrypt emails only",
      "Translate domain names to IP addresses",
      "Assign printer queues",
      "Fragment IP packets"
    ],
    "answer": 1,
    "explanation": "The Domain Name System maps human-readable names such as example.com to IP addresses."
  },
  {
    "id": "cn-m-3",
    "topic": "Computer Networks",
    "difficulty": "Medium",
    "b": -0.1,
    "question": "Which OSI layer is responsible for end-to-end reliable delivery?",
    "options": [
      "Physical",
      "Data link",
      "Transport",
      "Presentation"
    ],
    "answer": 2,
    "explanation": "The transport layer (TCP) provides end-to-end communication services, including reliability when required."
  },
  {
    "id": "cn-m-4",
    "topic": "Computer Networks",
    "difficulty": "Medium",
    "b": 0.2,
    "question": "A subnet mask is used to:",
    "options": [
      "Hide a Wi-Fi password",
      "Separate the network and host portions of an IP address",
      "Compress packets",
      "Replace MAC addresses"
    ],
    "answer": 1,
    "explanation": "The mask identifies which bits of an IP address represent the network versus the host."
  },
  {
    "id": "cn-h-1",
    "topic": "Computer Networks",
    "difficulty": "Hard",
    "b": 1.0,
    "question": "Slow start in TCP congestion control does which of the following?",
    "options": [
      "Immediately uses the full path capacity",
      "Grows the congestion window exponentially until a threshold",
      "Disables acknowledgements",
      "Works only with UDP"
    ],
    "answer": 1,
    "explanation": "TCP slow start increases cwnd exponentially with ACKs until ssthresh, then typically switches to congestion avoidance."
  },
  {
    "id": "cn-h-2",
    "topic": "Computer Networks",
    "difficulty": "Hard",
    "b": 1.2,
    "question": "CSMA/CD is associated with which classic network technology?",
    "options": [
      "Bluetooth only",
      "Traditional Ethernet",
      "GSM voice calls",
      "Satellite TV"
    ],
    "answer": 1,
    "explanation": "Carrier Sense Multiple Access with Collision Detection was used on shared wired Ethernet to detect and recover from collisions."
  },
  {
    "id": "cn-h-3",
    "topic": "Computer Networks",
    "difficulty": "Hard",
    "b": 1.1,
    "question": "In distance-vector routing, the count-to-infinity problem is caused by:",
    "options": [
      "Slow DNS",
      "Routing loops and slow convergence after a failure",
      "Too many MAC addresses",
      "HTTP caching"
    ],
    "answer": 1,
    "explanation": "When a link fails, distance-vector protocols may keep incrementing hop counts around a loop before the route is dropped."
  },
  {
    "id": "cn-h-4",
    "topic": "Computer Networks",
    "difficulty": "Hard",
    "b": 0.9,
    "question": "Which protocol is connectionless at the transport layer?",
    "options": [
      "TCP",
      "UDP",
      "HTTP",
      "FTP"
    ],
    "answer": 1,
    "explanation": "UDP sends datagrams without establishing a connection. HTTP and FTP run over TCP."
  },
  {
    "id": "dm-e-1",
    "topic": "Discrete Mathematics",
    "difficulty": "Easy",
    "b": -1.1,
    "question": "The set {1, 2, 3} ∪ {3, 4} equals:",
    "options": [
      "{3}",
      "{1, 2, 3, 4}",
      "{1, 2, 4}",
      "{}"
    ],
    "answer": 1,
    "explanation": "Union includes every element that appears in at least one of the sets."
  },
  {
    "id": "dm-e-2",
    "topic": "Discrete Mathematics",
    "difficulty": "Easy",
    "b": -1.0,
    "question": "A proposition is a statement that is:",
    "options": [
      "Always a question",
      "Either true or false, but not both",
      "An opinion only",
      "A programming loop"
    ],
    "answer": 1,
    "explanation": "In propositional logic, a proposition has a definite truth value: true or false."
  },
  {
    "id": "dm-e-3",
    "topic": "Discrete Mathematics",
    "difficulty": "Easy",
    "b": -0.9,
    "question": "The binary representation of decimal 5 is:",
    "options": [
      "100",
      "101",
      "110",
      "111"
    ],
    "answer": 1,
    "explanation": "5 = 4 + 1 = 2² + 2⁰, which is 101 in binary."
  },
  {
    "id": "dm-e-4",
    "topic": "Discrete Mathematics",
    "difficulty": "Easy",
    "b": -1.2,
    "question": "How many edges does a tree with n vertices have?",
    "options": [
      "n",
      "n - 1",
      "n + 1",
      "2n"
    ],
    "answer": 1,
    "explanation": "A tree is an acyclic connected graph and always has n − 1 edges."
  },
  {
    "id": "dm-m-1",
    "topic": "Discrete Mathematics",
    "difficulty": "Medium",
    "b": 0.0,
    "question": "P → Q is logically equivalent to:",
    "options": [
      "P ∧ Q",
      "¬P ∨ Q",
      "P ∨ Q",
      "¬P ∧ ¬Q"
    ],
    "answer": 1,
    "explanation": "Implication P → Q is false only when P is true and Q is false, which matches ¬P ∨ Q."
  },
  {
    "id": "dm-m-2",
    "topic": "Discrete Mathematics",
    "difficulty": "Medium",
    "b": 0.1,
    "question": "The pigeonhole principle says that if n+1 items go into n boxes, then:",
    "options": [
      "Every box is empty",
      "At least one box contains two or more items",
      "All boxes have equal items",
      "No box has more than one item"
    ],
    "answer": 1,
    "explanation": "With more items than boxes, at least one box must contain at least two items."
  },
  {
    "id": "dm-m-3",
    "topic": "Discrete Mathematics",
    "difficulty": "Medium",
    "b": -0.1,
    "question": "A function f: A → B is injective if:",
    "options": [
      "Every element of B is mapped to",
      "Different elements of A map to different elements of B",
      "It is not a function",
      "A and B are empty"
    ],
    "answer": 1,
    "explanation": "Injective (one-to-one) means f(a1) = f(a2) implies a1 = a2."
  },
  {
    "id": "dm-m-4",
    "topic": "Discrete Mathematics",
    "difficulty": "Medium",
    "b": 0.2,
    "question": "The time complexity O(n²) + O(n) simplifies to:",
    "options": [
      "O(n)",
      "O(n²)",
      "O(1)",
      "O(n³)"
    ],
    "answer": 1,
    "explanation": "Big-O addition is dominated by the fastest-growing term, so O(n²) + O(n) = O(n²)."
  },
  {
    "id": "dm-h-1",
    "topic": "Discrete Mathematics",
    "difficulty": "Hard",
    "b": 1.1,
    "question": "In a simple undirected graph, the sum of all vertex degrees is:",
    "options": [
      "Equal to the number of vertices",
      "Equal to twice the number of edges",
      "Always odd",
      "Equal to the number of edges"
    ],
    "answer": 1,
    "explanation": "The handshaking lemma: each edge contributes to two degrees, so Σ deg(v) = 2|E|."
  },
  {
    "id": "dm-h-2",
    "topic": "Discrete Mathematics",
    "difficulty": "Hard",
    "b": 1.0,
    "question": "De Morgan's law states that ¬(P ∧ Q) is equivalent to:",
    "options": [
      "¬P ∧ ¬Q",
      "¬P ∨ ¬Q",
      "P ∨ Q",
      "P ∧ ¬Q"
    ],
    "answer": 1,
    "explanation": "¬(P ∧ Q) ≡ ¬P ∨ ¬Q. Likewise, ¬(P ∨ Q) ≡ ¬P ∧ ¬Q."
  },
  {
    "id": "dm-h-3",
    "topic": "Discrete Mathematics",
    "difficulty": "Hard",
    "b": 1.2,
    "question": "A recurrence T(n) = T(n/2) + O(1) with T(1) = O(1) solves to:",
    "options": [
      "O(n)",
      "O(log n)",
      "O(n log n)",
      "O(n²)"
    ],
    "answer": 1,
    "explanation": "This is the complexity of binary search: the input halves each time, giving a logarithmic number of steps."
  },
  {
    "id": "dm-h-4",
    "topic": "Discrete Mathematics",
    "difficulty": "Hard",
    "b": 0.9,
    "question": "Which graph is Eulerian (has an Euler circuit)?",
    "options": [
      "Any connected graph with all degrees odd",
      "A connected graph where every vertex has even degree",
      "Any tree with more than 2 vertices",
      "A disconnected graph with isolated vertices only"
    ],
    "answer": 1,
    "explanation": "Euler's theorem: a connected graph has an Euler circuit iff every vertex has even degree."
  }
];
window.TOPICS = [...new Set(window.QUESTION_BANK.map((question) => question.topic))];
window.DIFFICULTIES = ["Easy", "Medium", "Hard"];
window.POINTS_BY_DIFFICULTY = { Easy: 10, Medium: 15, Hard: 20 };
