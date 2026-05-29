import type { Challenge, ScoreboardUser, UserStats } from "../types";

export interface LocalChallenge extends Challenge {
  solveCount: number;
  tags: string[];
}

export const MOCK_CHALLENGES: LocalChallenge[] = [
  {
    id: "web-1",
    title: "Poisoned Signature (JWT Hijack)",
    category: "Web Exploitation",
    difficulty: "Easy",
    points: 100,
    description: "We found an administrative portal running with standard JSON Web Token cookies. The server validates signatures, but is there a way to force an insecure algorithm override, or can we bypass signatures entirely using an empty key payload? Unpack the token and elevate your privileges to admin.",
    isSolved: false,
    solveCount: 412,
    author: "cipher_monk",
    hint: "Look closely at the 'alg' header inside the base64-decoded token payload.",
    flag: "FLAG{jwt_alg_none_is_treason_0382}",
    attachmentName: "jwt_portal_src.zip",
    tags: ["JWT", "Authorization Bypass", "Insecure Cookie"]
  },
  {
    id: "web-3",
    title: "ProtoPoison: Prototype Pollution",
    category: "Web Exploitation",
    difficulty: "Hard",
    points: 400,
    description: "The user merge function inside our Express server seems dangerously recursive and takes unchecked JSON input. Pollute the global Object prototype and inject a payload that spawns a reverse shell or spawns administrative credentials inside the app context.",
    isSolved: false,
    solveCount: 45,
    author: "null_pointer",
    externalLink: "https://sandbox-poisson.ctf.arena",
    hint: "Inject '__proto__' inside deeply nested object parameters during setup merge.",
    flag: "FLAG{prototype_polluted_admin_spawn_9921}",
    tags: ["Prototype Pollution", "Express.js", "Remote Code Execution"]
  },
  {
    id: "crypto-1",
    title: "CJS Oracle: Symmetric Padding Underflow",
    category: "Cryptography",
    difficulty: "Medium",
    points: 250,
    description: "Our target utilizes AES-128 in CBC mode with standard PKCS#7 padding. The endpoint behaves strangely when corrupted blocks are sent: it returns a structural padding exception. Write an oracle script to decrypt the encrypted admin flag block by block, byte by byte.",
    isSolved: false,
    solveCount: 189,
    author: "black_hat_euler",
    attachmentName: "padding_oracle_helper.py",
    hint: "Corrupt the second-to-last ciphertext block and observe if the server still returns the custom error block.",
    flag: "FLAG{pkcs7_padding_oracle_bypassed_2931}",
    tags: ["AES-128-CBC", "Oracle Attack", "Side Channel"]
  },
  {
    id: "pwn-1",
    title: "Stack Smash: Kernel Return Poisoning",
    category: "Pwn",
    difficulty: "Insane",
    points: 600,
    description: "A custom native binary is running with standard ASLR enabled but misses Stack Canaries or NX protection. Trigger a buffer overflow on the stack, corrupt the RIP pointer to point to our injected shellcode inside the environmental parameters, and drop a stable root terminal shell.",
    isSolved: false,
    solveCount: 11,
    author: "gdb_ghost",
    attachmentName: "kernel_smasher.elf",
    hint: "Calculate the exact negative offset from the start of the buffer to the return program address inside GDB.",
    flag: "FLAG{stack_canary_slain_shellcode_4829}",
    tags: ["Buffer Overflow", "ASLR Bypass", "Shellcode Injection", "Binary Exploitation"]
  },
  {
    id: "rev-1",
    title: "Metamorphic Packer De-obfuscator",
    category: "Reverse Engineering",
    difficulty: "Medium",
    points: 300,
    description: "An analyst retrieved an executable containing metamorphic packing layers designed to alter its structure on runtime. Decouple the layers, decode the customized XOR shift sequence, locate the entry point instruction, and extract the secret decrypting routine.",
    isSolved: false,
    solveCount: 92,
    author: "radare_expert",
    attachmentName: "obfuscated_beast.bin",
    hint: "Set a hardware execution breakpoint inside x64dbg right after the primary virtual decrypt function runs.",
    flag: "FLAG{metamorphic_packer_unwrapped_7294}",
    tags: ["SMC", "XOR Decryption", "x64dbg", "Static Analysis"]
  },
  {
    id: "forensics-1",
    title: "Silent Wave: Exif GPS Corrupted Matrix",
    category: "Forensics",
    difficulty: "Easy",
    points: 150,
    description: "A threat actor exfiltrated a raw JPEG photograph containing coordinate data of a safehouse. However, they corrupted the headers to block standard file readers. Repair the JPEG header matrix, extract the hidden geographic latitude, and grab the flag in its metadata.",
    isSolved: false,
    solveCount: 310,
    author: "camera_crawler",
    attachmentName: "safehouse_corrupted.jpg",
    hint: "Look for the magic byte pattern 'FF D8 FF E1' to verify picture start and utilize hexedit.",
    flag: "FLAG{gps_magic_bytes_fixed_7109}",
    tags: ["Exif Tool", "Hex Editing", "Steg Repair"]
  },
  {
    id: "osint-1",
    title: "Project Apex: Satellite Footprints",
    category: "OSINT",
    difficulty: "Medium",
    points: 200,
    description: "Locate the precise military terminal referenced in a screenshot from an unsecured webcam feed. The image captures a launch platform with a unique horizon configuration and an atmospheric radar dish pointing at 220 degrees azimuth. Identify the airport code nearby.",
    isSolved: false,
    solveCount: 154,
    author: "sherlock_web",
    externalLink: "https://sat-radar-logs.military-intel.org",
    hint: "Cross-reference standard geostationary military satellites servicing that elevation angle with local airport coordinates.",
    flag: "FLAG{apex_military_airport_found_3921}",
    tags: ["Geolocation", "Satellite Footprint", "Open Source Intelligence"]
  },
  {
    id: "steg-1",
    title: "Spectral Hush: Audio LSB Infiltration",
    category: "Steganography",
    difficulty: "Hard",
    points: 350,
    description: "This WAV audio file sounds like perfect white noise, but its lowest bits hide a file structure. Employ a Least Significant Bit extraction pipeline, convert the binary output stream into a clean ZIP archive, and read the protected file inside.",
    isSolved: false,
    solveCount: 68,
    author: "soundwave_hacker",
    attachmentName: "ambient_hush.wav",
    hint: "Write a quick python script using the soundfile library to grab and render the LSB of every channel.",
    flag: "FLAG{spectral_audio_lsb_unveiled_8832}",
    tags: ["LSB Steg", "Audio Analysis", "Spectral Rendering"]
  }
];

export const MOCK_SCOREBOARD: ScoreboardUser[] = [
  { rank: 1, username: "0xVoid_Walker", clan: "Korn_Shell_Elite", points: 3450, solves: 14, lastSolveTime: "2 mins ago" },
  { rank: 2, username: "nullPointer_X", clan: "Binary_Beasts", points: 3120, solves: 13, lastSolveTime: "15 mins ago" },
  { rank: 3, username: "Sudo_Hacks", clan: "Root_Raiders", points: 2950, solves: 11, lastSolveTime: "45 mins ago" },
  { rank: 4, username: "cyber_krypton", clan: "Prime_Divisors", points: 2600, solves: 10, lastSolveTime: "1 hr ago" },
  { rank: 5, username: "you", clan: "Lone_Wolf", points: 1250, solves: 5, lastSolveTime: "Yesterday", isCurrentUser: true },
  { rank: 6, username: "gdb_phantom", clan: "Stack_Overlords", points: 2120, solves: 8, lastSolveTime: "2 hrs ago" },
  { rank: 7, username: "alice_xor", clan: "Korn_Shell_Elite", points: 1980, solves: 7, lastSolveTime: "3 hrs ago" },
  { rank: 8, username: "fuzzING_god", clan: "Binary_Beasts", points: 1750, solves: 6, lastSolveTime: "5 hrs ago" }
];

export const MOCK_USER_STATS: UserStats = {
  username: "op_guest",
  avatarSeed: "hacker-pro-9921",
  points: 1250,
  globalRank: 5,
  solvesCount: 5,
  longestStreak: 12,
  currentStreak: 4,
  categoriesProgress: {
    "Web Exploitation": { solved: 2, total: 3 },
    "Reverse Engineering": { solved: 1, total: 2 },
    "Cryptography": { solved: 1, total: 2 },
    "Forensics": { solved: 1, total: 1 },
    "OSINT": { solved: 0, total: 1 },
    "Steganography": { solved: 0, total: 1 },
    "Miscellaneous": { solved: 0, total: 0 },
    "Pwn": { solved: 0, total: 1 }
  },
  recentSolves: [
    { challengeTitle: "Poisoned Signature (JWT Hijack)", points: 100, timeAgo: "2 hrs ago", category: "Web Exploitation" },
    { challengeTitle: "CJS Oracle: Symmetric Padding Oracle", points: 250, timeAgo: "1 day ago", category: "Cryptography" },
    { challengeTitle: "Silent Wave: Exif GPS Matrix", points: 150, timeAgo: "Yesterday", category: "Forensics" }
  ]
};
