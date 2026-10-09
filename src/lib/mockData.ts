import type { Collection, Genre, MockMovie } from "./types";

/**
 * Local fallback data, used whenever NEXT_PUBLIC_TMDB_API_KEY is missing or
 * TMDB is unreachable. Snapshot of TMDB popular / top rated movies and series with their
 * official YouTube trailer keys.
 */

export const HLS_TEST_STREAM = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
export const LOCAL_MP4_FALLBACK = "/videos/sample.mp4";

export const POSTER_PLACEHOLDER = "/posters/placeholder.svg";
export const BACKDROP_PLACEHOLDER = "/images/backdrop-placeholder.svg";

export const mockGenres: Genre[] = [
  {
    "id": 28,
    "name": "Action"
  },
  {
    "id": 12,
    "name": "Adventure"
  },
  {
    "id": 16,
    "name": "Animation"
  },
  {
    "id": 35,
    "name": "Comedy"
  },
  {
    "id": 80,
    "name": "Crime"
  },
  {
    "id": 99,
    "name": "Documentary"
  },
  {
    "id": 18,
    "name": "Drama"
  },
  {
    "id": 10751,
    "name": "Family"
  },
  {
    "id": 14,
    "name": "Fantasy"
  },
  {
    "id": 36,
    "name": "History"
  },
  {
    "id": 27,
    "name": "Horror"
  },
  {
    "id": 10402,
    "name": "Music"
  },
  {
    "id": 9648,
    "name": "Mystery"
  },
  {
    "id": 10749,
    "name": "Romance"
  },
  {
    "id": 878,
    "name": "Science Fiction"
  },
  {
    "id": 10770,
    "name": "TV Movie"
  },
  {
    "id": 53,
    "name": "Thriller"
  },
  {
    "id": 10752,
    "name": "War"
  },
  {
    "id": 37,
    "name": "Western"
  }
];

export const mockMovies: MockMovie[] = [
  {
    "id": 969681,
    "mediaType": "movie",
    "title": "Spider-Man: Brand New Day",
    "overview": "Fighting crime full-time as Spider-Man in a world that doesn't remember him—and the pressure of seeing his old friends move on without him—sparks a change in Peter Parker he may not have the power to control. But that transformation might also be the only thing that can stop a shocking new threat to the city and those he loves - a powerful villain no one can even see.",
    "posterPath": "/bjiS5ipwxb9JFy3XRRN4OAilSeX.jpg",
    "backdropPath": "/qeQJx07rK2xm8SD2sJxFKhE7gs0.jpg",
    "releaseDate": "2026-07-29",
    "voteAverage": 7.9,
    "voteCount": 2959,
    "genreIds": [
      878,
      28,
      12
    ],
    "popularity": 597,
    "originalLanguage": "en",
    "trailerKey": "P3uI5sLosKU"
  },
  {
    "id": 1423191,
    "mediaType": "movie",
    "title": "Resident Evil",
    "overview": "Medical courier Bryan unwittingly finds himself fighting for survival as one fateful, horrifying night collapses around him in chaos.",
    "posterPath": "/i7UyjfPio0VFHB9rBUZSFyhOoM8.jpg",
    "backdropPath": "/3icyRAqgakNcQn6aDVz9libFmBA.jpg",
    "releaseDate": "2026-09-16",
    "voteAverage": 7.3,
    "voteCount": 633,
    "genreIds": [
      27,
      878,
      12
    ],
    "popularity": 416,
    "originalLanguage": "en",
    "trailerKey": "mNd1gb19A-c"
  },
  {
    "id": 1204680,
    "mediaType": "movie",
    "title": "Coyote vs. Acme",
    "overview": "After Acme products fail him one too many times in his dogged pursuit of the Roadrunner, Wile E. Coyote decides to hire a billboard lawyer to sue the Acme Corporation.",
    "posterPath": "/kYDCl2y0VPvhT5eYWbMRInPoB03.jpg",
    "backdropPath": "/7GOW6jod9lLurW5utokAatxg7ql.jpg",
    "releaseDate": "2026-08-17",
    "voteAverage": 7.6,
    "voteCount": 587,
    "genreIds": [
      35,
      12,
      10751
    ],
    "popularity": 326,
    "originalLanguage": "en",
    "trailerKey": "kMsiD1Nky5I"
  },
  {
    "id": 1368337,
    "mediaType": "movie",
    "title": "The Odyssey",
    "overview": "Odysseus, the legendary King of Ithaca, embarks on a long and perilous journey home following the Trojan War. Throughout his voyage, he is forced to confront the whims of gods, mythological monsters, and trials that stretch both his cunning and his humanity to the breaking point.",
    "posterPath": "/5rhTDKUhPYvpdQIijFIs5VoWsON.jpg",
    "backdropPath": "/bulFtfy3oBQtCnAMSi7g6DSSds3.jpg",
    "releaseDate": "2026-07-15",
    "voteAverage": 8,
    "voteCount": 3982,
    "genreIds": [
      12,
      28,
      14
    ],
    "popularity": 315,
    "originalLanguage": "en",
    "trailerKey": "AyIZ9tiiN8I"
  },
  {
    "id": 1101383,
    "mediaType": "movie",
    "title": "The End of Oak Street",
    "overview": "After a mysterious cosmic event rips Oak Street from suburbia and transports their neighborhood to someplace unknown, the Platt family soon discovers that their very survival depends on them sticking together as they navigate their now unrecognizable surroundings.",
    "posterPath": "/fYXqpgPmHMphSF2W30GbTeJVIa5.jpg",
    "backdropPath": "/b9q9VmbXDvJmTziRqkwdEmFdwhr.jpg",
    "releaseDate": "2026-08-12",
    "voteAverage": 7.1,
    "voteCount": 1724,
    "genreIds": [
      878,
      9648,
      53
    ],
    "popularity": 281,
    "originalLanguage": "en",
    "trailerKey": "u4tgctWuHc0"
  },
  {
    "id": 1032863,
    "mediaType": "movie",
    "title": "The Love Hypothesis",
    "overview": "Olive Smith, a biology PhD candidate, and Dr. Adam Carlsen, a hotshot professor and well-known tyrant, enter into a fake relationship, seeing each of their carefully calculated theories on love get thrown into chaos.",
    "posterPath": "/vfZxVHextAGC70zrNhS8lsROqP1.jpg",
    "backdropPath": "/o7Oy9Gbx1CCyaweL8xUhtMW4Puq.jpg",
    "releaseDate": "2026-09-23",
    "voteAverage": 8.1,
    "voteCount": 389,
    "genreIds": [
      10749,
      35
    ],
    "popularity": 254,
    "originalLanguage": "en",
    "trailerKey": "xwdamnfS6IM"
  },
  {
    "id": 1228834,
    "mediaType": "movie",
    "title": "The Fix",
    "overview": "Disillusioned by the end of the war in Afghanistan, a group of disgraced, war-torn ex-CIA operatives set out to Tehran to take down a life-changing score.",
    "posterPath": "/9iSkee8DPpwBQI3GhXSTGZJKNYM.jpg",
    "backdropPath": "/dJTWIecL2vxsCRl5G0lRhPsfrhc.jpg",
    "releaseDate": "2026-09-10",
    "voteAverage": 7.1,
    "voteCount": 40,
    "genreIds": [
      28,
      53
    ],
    "popularity": 257,
    "originalLanguage": "en",
    "trailerKey": "l5Luvr9TRRc"
  },
  {
    "id": 1751701,
    "mediaType": "movie",
    "title": "After Impact",
    "overview": "After losing his father, Ethan Nichols inherits one of the largest greenhouses in the country, just as the world faces a devastating threat from an approaching asteroid. As society begins to unravel, Ethan grapples with personal betrayal, overwhelming loneliness, and the growing fear that survival may come at the cost of his humanity. Seeking refuge in his family’s bunker, Ethan endures the harsh aftermath of the impact, wrestling with physical injury and emotional despair. When a faint voice crackles over his radio, Ethan discovers he's not as alone as he believed.",
    "posterPath": "/yzDuAQCY2n6zzOlBkn6JzhLhY3k.jpg",
    "backdropPath": "/k22XyPbce7zvzzf5OnT4uaY8ZD1.jpg",
    "releaseDate": "2026-09-15",
    "voteAverage": 6.4,
    "voteCount": 17,
    "genreIds": [
      878,
      18,
      53
    ],
    "popularity": 250,
    "originalLanguage": "en",
    "trailerKey": "Af8D6sRDyxo"
  },
  {
    "id": 1294189,
    "mediaType": "movie",
    "title": "The Mongoose",
    "overview": "A falsely accused war hero with nothing to lose leads police on an epic televised cross-country car chase, helped by members of his former Special Forces Army battalion and closely monitored by a fascinated public rooting for his safe getaway.",
    "posterPath": "/eSS5mvSG84UUuvtbHel5Yu3Wik4.jpg",
    "backdropPath": "/iRIhPqqoUHiFBxn8oYf3gCQnaKk.jpg",
    "releaseDate": "2026-10-29",
    "voteAverage": 0,
    "voteCount": 0,
    "genreIds": [
      28,
      53
    ],
    "popularity": 215,
    "originalLanguage": "en",
    "trailerKey": "aHrMFtt40_Q"
  },
  {
    "id": 1377237,
    "mediaType": "movie",
    "title": "Runner",
    "overview": "A former soldier is thrown into a brutal race against time when a critical medical delivery makes him and his unlikely partner the targets of a ruthless cartel. As the mission spirals into a deadly manhunt, every detour, delay, and bullet pushes them closer to failure. With betrayal closing in from every side, they must survive the chase and deliver their cargo to save the life of a little girl.",
    "posterPath": "/yBKMAIj7clP42UkFejhGDBBoTpb.jpg",
    "backdropPath": "/2c9zNZJL0ZdagD6JbmU3hH4hovs.jpg",
    "releaseDate": "2026-09-07",
    "voteAverage": 8.2,
    "voteCount": 207,
    "genreIds": [
      28,
      35
    ],
    "popularity": 244,
    "originalLanguage": "en",
    "trailerKey": "B6Z9MM1LhEA"
  },
  {
    "id": 1288445,
    "mediaType": "movie",
    "title": "Mutiny",
    "overview": "After witnessing his billionaire boss' murder and being framed for the crime, Cole Reed boards a cargo ship on a one-man crusade to avenge his boss' death only to discover an international conspiracy.",
    "posterPath": "/pu2VxGlpGwffOx292w18b1tv96j.jpg",
    "backdropPath": "/e2QAGrEmbpmZpMymDRkDisJkvg9.jpg",
    "releaseDate": "2026-08-19",
    "voteAverage": 7.4,
    "voteCount": 723,
    "genreIds": [
      28,
      53
    ],
    "popularity": 189,
    "originalLanguage": "en",
    "trailerKey": "2Iqvbe98Gb4"
  },
  {
    "id": 1375646,
    "mediaType": "movie",
    "title": "Colony",
    "overview": "Professor Se-jeong is thrust into a bloody nightmare when a rapidly mutating virus is released during a biotech conference causing authorities to seal the facility. Trapped inside with no escape, Se-jeong along with a small group of survivors must fight to stay alive while the infected undergo horrific transformations.",
    "posterPath": "/tN799oUR0f1gUKDYdMNrDaY7I51.jpg",
    "backdropPath": "/hpBGCnzOvdtQoMyE48gvwp2y5yx.jpg",
    "releaseDate": "2026-05-21",
    "voteAverage": 8.1,
    "voteCount": 981,
    "genreIds": [
      27,
      28,
      878
    ],
    "popularity": 191,
    "originalLanguage": "ko",
    "trailerKey": "LW6dpj1uCK8"
  },
  {
    "id": 1263337,
    "mediaType": "movie",
    "title": "Heart of the Beast",
    "overview": "After a harrowing plane crash, Special Forces officer James Belmont and his combat dog, Odin, find themselves stranded deep in the Alaskan wilderness. Together, they are forced into a brutal fight for survival against the elements.",
    "posterPath": "/mYqiF90igComG2L2qm8SwFbaMwn.jpg",
    "backdropPath": "/bicMU6xVD5deVyKP2azpyx7xkmH.jpg",
    "releaseDate": "2026-09-19",
    "voteAverage": 7.6,
    "voteCount": 158,
    "genreIds": [
      12,
      53
    ],
    "popularity": 170,
    "originalLanguage": "en",
    "trailerKey": "UkMuGKqAux4"
  },
  {
    "id": 1084244,
    "mediaType": "movie",
    "title": "Toy Story 5",
    "overview": "When Bonnie receives a Lilypad tablet as a gift and becomes obsessed, Buzz, Woody, Jessie and the rest of the gang's jobs become exponentially harder when they have to go head to head with the all-new threat to playtime.",
    "posterPath": "/sfQtVlIHljToOwYjhe21KPGzZWK.jpg",
    "backdropPath": "/4D1pdB27uph7J8HQzNf8QvvH9bn.jpg",
    "releaseDate": "2026-06-17",
    "voteAverage": 8.3,
    "voteCount": 2432,
    "genreIds": [
      16,
      10751,
      35,
      12
    ],
    "popularity": 180,
    "originalLanguage": "en",
    "trailerKey": "QftAW9TTmuQ"
  },
  {
    "id": 1492640,
    "mediaType": "movie",
    "title": "UNABOMBER",
    "overview": "Follow Ted Kaczynski's transformation from Harvard prodigy into the infamous Unabomber. Subjected to controversial psychological experiments by Professor Henry Murray, Kaczynski's troubled past resurfaces decades later when his manhunt, led by FBI agent Joanne Miller, brings to light the chilling consequences of ambition and isolation.",
    "posterPath": "/39aMkR8Y5vhCG9dTkjiqRl8AVqp.jpg",
    "backdropPath": "/58D9nalUYW5L5K0guw7hcpsEJBH.jpg",
    "releaseDate": "2026-09-25",
    "voteAverage": 6.7,
    "voteCount": 227,
    "genreIds": [
      53,
      18,
      80
    ],
    "popularity": 176,
    "originalLanguage": "en",
    "trailerKey": "B3tR6qQjbgI"
  },
  {
    "id": 460458,
    "mediaType": "movie",
    "title": "Resident Evil: Welcome to Raccoon City",
    "overview": "Once the booming home of pharmaceutical giant Umbrella Corporation, Raccoon City is now a dying Midwestern town. The company’s exodus left the city a wasteland…with great evil brewing below the surface. When that evil is unleashed, the townspeople are forever…changed…and a small group of survivors must work together to uncover the truth behind Umbrella and make it through the night.",
    "posterPath": "/bArhvjRHl535XMaSh9VjInF2mSZ.jpg",
    "backdropPath": "/wYtEvBmpBRXPdwGgr1gcWiwJSI7.jpg",
    "releaseDate": "2021-11-24",
    "voteAverage": 5.9,
    "voteCount": 2827,
    "genreIds": [
      28,
      27,
      878
    ],
    "popularity": 169,
    "originalLanguage": "en",
    "trailerKey": "IQqqAWMIIAQ"
  },
  {
    "id": 1339713,
    "mediaType": "movie",
    "title": "Obsession",
    "overview": "After breaking the mysterious \"One Wish Willow\" to win his crush's heart, a hopeless romantic finds himself getting exactly what he asked for but soon discovers that some desires come at a dark, sinister price.",
    "posterPath": "/bRwnj8WEKBCvmfeUNOukJPwB43K.jpg",
    "backdropPath": "/5lTZyuBTNOfawsfPT8Q0cIg6qAF.jpg",
    "releaseDate": "2026-05-13",
    "voteAverage": 8.2,
    "voteCount": 5852,
    "genreIds": [
      27,
      53
    ],
    "popularity": 163,
    "originalLanguage": "en",
    "trailerKey": "gMC8kkwbIQQ"
  },
  {
    "id": 1607127,
    "mediaType": "movie",
    "title": "One Last Shot",
    "overview": "Navy Seal Jake Harris must stop a team of mercenaries, led by his disillusioned former comrade, from disabling the US missile defense network.",
    "posterPath": "/niQ4NBh2jqAf1hDZP5m6ReWFAb7.jpg",
    "backdropPath": "/8giIQcHpxgsPVP6c7aQtHl3txuh.jpg",
    "releaseDate": "2026-09-22",
    "voteAverage": 7.4,
    "voteCount": 80,
    "genreIds": [
      28,
      53
    ],
    "popularity": 125,
    "originalLanguage": "en",
    "trailerKey": "8PAy3i9uU0A"
  },
  {
    "id": 1482547,
    "mediaType": "movie",
    "title": "Zip Wire",
    "overview": "When her ground-breaking pharmaceutical discovery is stolen and partner murdered, researcher Amy must face her fear of heights to escape nefarious attackers, with the only path to salvation being a treacherous aerial runway. To outsmart the mysterious hostiles, she has to summon every ounce of courage to protect the world-changing scientific discovery — and herself — before it's too late.",
    "posterPath": "/cO7J0XSVKPlAjUCMWC7DVBn1Py2.jpg",
    "backdropPath": "/sbkkAtymJaH5UzExiK974uPzCY4.jpg",
    "releaseDate": "2026-08-31",
    "voteAverage": 7.5,
    "voteCount": 17,
    "genreIds": [
      28,
      53
    ],
    "popularity": 129,
    "originalLanguage": "en",
    "trailerKey": "M9tHmu0wNHM"
  },
  {
    "id": 1248832,
    "mediaType": "movie",
    "title": "Digger",
    "overview": "The most powerful man in the world embarks on a frantic mission to prove he is humanity's savior before the disaster he's unleashed destroys everything.",
    "posterPath": "/1ATXKrIPJyKNwnJ6lcG088Sa6zi.jpg",
    "backdropPath": "/4A3r1AjJg9Wa6ms3MGOScetCY0o.jpg",
    "releaseDate": "2026-09-28",
    "voteAverage": 7.3,
    "voteCount": 22,
    "genreIds": [
      35,
      18
    ],
    "popularity": 183,
    "originalLanguage": "en",
    "trailerKey": "job8V254NAE"
  },
  {
    "id": 1560520,
    "mediaType": "movie",
    "title": "Batman: Knightfall Part 1: Knightfall",
    "overview": "Arkham Asylum has been destroyed, and all its inmates have been unleashed upon Gotham City. As Batman races to round up some of his greatest enemies, he is pushed to his physical and mental limits and into a final confrontation with a new threat: the man called Bane!",
    "posterPath": "/360qdtu2hLnqMu8SVHMywn420w1.jpg",
    "backdropPath": "/caBIySpwuFi2i7ynvHIlnxJLOdN.jpg",
    "releaseDate": "2026-06-23",
    "voteAverage": 9.2,
    "voteCount": 405,
    "genreIds": [
      16,
      28,
      12,
      18
    ],
    "popularity": 55,
    "originalLanguage": "en",
    "trailerKey": "90HAqMk7qv0"
  },
  {
    "id": 980431,
    "mediaType": "movie",
    "title": "Avatar Aang: The Last Airbender",
    "overview": "Avatar Aang, the world's last Airbender, learns of an ancient power that could save his culture from extinction. With the help of his friends, he embarks on a global quest to find it before it falls into the wrong hands and threatens to upend the peace they sacrificed everything to achieve.",
    "posterPath": "/3sgnSfNT27Bx5O5ukr7B26mhEQq.jpg",
    "backdropPath": "/ezbrL1dMymKQZw7mDEWa2ZTzN7d.jpg",
    "releaseDate": "2026-07-24",
    "voteAverage": 9.1,
    "voteCount": 1218,
    "genreIds": [
      16,
      12,
      14,
      28
    ],
    "popularity": 72,
    "originalLanguage": "en",
    "trailerKey": "7b20GRFZBFE"
  },
  {
    "id": 1007757,
    "mediaType": "movie",
    "title": "Swapped",
    "overview": "A small woodland creature and a majestic bird, two natural sworn enemies of the Valley, magically trade places and set off on an adventure of a lifetime to switch back. Their journey soon uncovers a greater threat—one that could endanger not only their species, but the entire valley they call home.",
    "posterPath": "/tHhxWxge06goXU6ZQH1hj7vK8Hd.jpg",
    "backdropPath": "/zMwhWailP1WY7sb6AoE6b8ugoy.jpg",
    "releaseDate": "2026-05-01",
    "voteAverage": 8.9,
    "voteCount": 2216,
    "genreIds": [
      12,
      16,
      10751,
      14
    ],
    "popularity": 43,
    "originalLanguage": "en",
    "trailerKey": "glgmAwRDP8s"
  },
  {
    "id": 1632181,
    "mediaType": "movie",
    "title": "Accidental Partners",
    "overview": "Two women discover they were both scammed by the same man (who also got them pregnant). They form an alliance to take revenge.",
    "posterPath": "/j0CIVzeR7hRAPBPGR54qDZoOQpp.jpg",
    "backdropPath": "/iCML6fBe3X0y06P33bM7dyYXPKZ.jpg",
    "releaseDate": "2026-03-12",
    "voteAverage": 8.8,
    "voteCount": 391,
    "genreIds": [
      35,
      10749
    ],
    "popularity": 15,
    "originalLanguage": "es",
    "trailerKey": "tsjsPgnCM2U"
  }
];

export const mockTvGenres: Genre[] = [
  {
    "id": 10759,
    "name": "Action & Adventure"
  },
  {
    "id": 16,
    "name": "Animation"
  },
  {
    "id": 35,
    "name": "Comedy"
  },
  {
    "id": 80,
    "name": "Crime"
  },
  {
    "id": 99,
    "name": "Documentary"
  },
  {
    "id": 18,
    "name": "Drama"
  },
  {
    "id": 10751,
    "name": "Family"
  },
  {
    "id": 10762,
    "name": "Kids"
  },
  {
    "id": 9648,
    "name": "Mystery"
  },
  {
    "id": 10763,
    "name": "News"
  },
  {
    "id": 10764,
    "name": "Reality"
  },
  {
    "id": 10765,
    "name": "Sci-Fi & Fantasy"
  },
  {
    "id": 10766,
    "name": "Soap"
  },
  {
    "id": 10767,
    "name": "Talk"
  },
  {
    "id": 10768,
    "name": "War & Politics"
  },
  {
    "id": 37,
    "name": "Western"
  }
];

export const mockShows: MockMovie[] = [
  {
    "id": 276161,
    "mediaType": "tv",
    "title": "Teach You a Lesson",
    "overview": "An inspector from the Educational Rights Protection Bureau (ERPB) who is authorized by the government to use physical intervention and unconventional methods to discipline delinquent students and reform the educational system.",
    "posterPath": "/fMECSPrTmRClSViMsXFYmiYIcWP.jpg",
    "backdropPath": "/vyG93jhmPL7tBIhRtCLa5mdBKob.jpg",
    "releaseDate": "2026-06-05",
    "voteAverage": 9.4,
    "voteCount": 947,
    "genreIds": [
      10759,
      18,
      35
    ],
    "popularity": 57,
    "originalLanguage": "ko",
    "trailerKey": "LdezlX84py0",
    "seasonEpisodeCounts": [
      10
    ]
  },
  {
    "id": 299167,
    "mediaType": "tv",
    "title": "Dutton Ranch",
    "overview": "Rip Wheeler and Beth Dutton gamble everything on a new life in South Texas, but the promise of building a future far from the ghosts of Yellowstone quickly collides with brutal new realities and a rival ranch that will stop at nothing to protect its empire.",
    "posterPath": "/xsiecCxd8lkcAluw0wWwbW5CwSv.jpg",
    "backdropPath": "/ewlmL0nxo2lLqBj69upgp2gjHpV.jpg",
    "releaseDate": "2026-05-15",
    "voteAverage": 9.1,
    "voteCount": 608,
    "genreIds": [
      37,
      18
    ],
    "popularity": 50,
    "originalLanguage": "en",
    "trailerKey": "k6cjKNZBQ1M",
    "seasonEpisodeCounts": [
      9
    ]
  },
  {
    "id": 278573,
    "mediaType": "tv",
    "title": "Perfect Crown",
    "overview": "In 21st-century Korea under a constitutional monarchy, a chaebol heiress with everything but status tries to take control of her future after crossing paths with a lonely prince with nothing but his title. Together, bound by a contract marriage, they begin a class-defying romance to rewrite destiny.",
    "posterPath": "/ocXkHSslrSWMz2ZJGl5MjF6dQr3.jpg",
    "backdropPath": "/6ekykPwvAywJRjFEnUoCFWTO9O3.jpg",
    "releaseDate": "2026-04-10",
    "voteAverage": 9,
    "voteCount": 217,
    "genreIds": [
      35,
      18
    ],
    "popularity": 25,
    "originalLanguage": "ko",
    "trailerKey": "MOXFNE9x1G4",
    "seasonEpisodeCounts": [
      12
    ]
  },
  {
    "id": 273240,
    "mediaType": "tv",
    "title": "Off Campus",
    "overview": "Hannah Wells tutors hockey captain Garrett Graham to win over her crush. Their deal becomes real connection as they face their pasts. Friends Logan, Dean, Tucker, and Allie navigate college life and love.",
    "posterPath": "/tcPc5ZMBO4y2BtCJMe3o2nwZb2B.jpg",
    "backdropPath": "/3ANXZWhhcqPAh0q6nRZ979TIwxC.jpg",
    "releaseDate": "2026-05-13",
    "voteAverage": 8.9,
    "voteCount": 871,
    "genreIds": [
      18
    ],
    "popularity": 77,
    "originalLanguage": "en",
    "trailerKey": "wAozjf2frxw",
    "seasonEpisodeCounts": [
      8
    ]
  },
  {
    "id": 214999,
    "mediaType": "tv",
    "title": "The Good Bad Mother",
    "overview": "A tragic accident leaves an ambitious prosecutor with the mind of a child – forcing him and his mother to embark on a journey to heal their relationship.",
    "posterPath": "/vtDLhvpTk1xcaBCKubSH0if575G.jpg",
    "backdropPath": "/zOZqdv7UTc2sP2Tu5Cxj8j1M2r8.jpg",
    "releaseDate": "2023-04-26",
    "voteAverage": 8.9,
    "voteCount": 200,
    "genreIds": [
      18,
      35
    ],
    "popularity": 12,
    "originalLanguage": "ko",
    "trailerKey": "wyk2FtMAXfY",
    "seasonEpisodeCounts": [
      14
    ]
  },
  {
    "id": 322430,
    "mediaType": "tv",
    "title": "The Polygamist",
    "overview": "Social media darling, Joyce, is the picture of marital perfection — until her cheating husband's conquests ignite a scandalous emotional meltdown.",
    "posterPath": "/vamznpYBCI9n7VhrI3mxuzff7XP.jpg",
    "backdropPath": "/hGCQ0tsJMpKjfrnCyYY0kMY2kY1.jpg",
    "releaseDate": "2026-06-12",
    "voteAverage": 8.9,
    "voteCount": 211,
    "genreIds": [
      18,
      10766
    ],
    "popularity": 32,
    "originalLanguage": "zu",
    "trailerKey": "KBJllQVRuAA",
    "seasonEpisodeCounts": [
      22
    ]
  },
  {
    "id": 245026,
    "mediaType": "tv",
    "title": "Wizards Beyond Waverly Place",
    "overview": "Justin Russo has chosen to lead a normal, mortal life with his family, Giada, Roman and Milo. But when Justin's sister Alex brings Billie to his home seeking help, Justin realizes he must dust off his magical skills to mentor the wizard-in-training while also juggling his everyday responsibilities — and safeguarding the future of the Wizard World.",
    "posterPath": "/5hrBpjFzIqmN9k7QxEC610gwZGw.jpg",
    "backdropPath": "/TxicZcsiP9VHYXMYHm4IEHnwv9.jpg",
    "releaseDate": "2024-10-29",
    "voteAverage": 8.8,
    "voteCount": 206,
    "genreIds": [
      35,
      10765,
      10751
    ],
    "popularity": 28,
    "originalLanguage": "en",
    "trailerKey": "M_3dQ6ofXwI",
    "seasonEpisodeCounts": [
      21,
      10,
      4
    ]
  },
  {
    "id": 91759,
    "mediaType": "tv",
    "title": "Come Home Love: Lo and Behold",
    "overview": "Hung Sue Gan starting from the bottom, established his own logistics company, which is now running smoothly. His only concern now are his three daughters. His eldest daughter has immigrated overseas. His second daughter Hung Yeuk Shui has reached the marriageable age, but has no hopes for marriage anytime soon. She is constantly bickering with her younger sister Hung Sum Yue, who is an honour student, over trivial matters, causing their father to not know whether to laugh or cry. Hung Sue Yan, Hung Sue Gan's brother, moves in with the family, temporarily ending his life as a nomadic photographer. He joins Hung Yeuk Shui's company and encounters Ko Pak Fei, the director of an online shop. The two appear to be former lovers, making for lots of laughter. Since Hung Sue Yan moved in, a series of strange events have occurred in the family. Upon investigation, the source is traced to Lung Ging Fung, a promising young man who is the son of department store mogul Lung Gam Wai.",
    "posterPath": "/lgD4j9gUGmMckZpWWRJjorWqGVT.jpg",
    "backdropPath": "/dyFTt1a9ZpFdKE96kPlE9fQvXOJ.jpg",
    "releaseDate": "2017-02-20",
    "voteAverage": 5.4,
    "voteCount": 46,
    "genreIds": [
      10751,
      35,
      18
    ],
    "popularity": 1121,
    "originalLanguage": "cn",
    "trailerKey": "TDHiTXSRcP4",
    "seasonEpisodeCounts": [
      2868
    ]
  },
  {
    "id": 2734,
    "mediaType": "tv",
    "title": "Law & Order: Special Victims Unit",
    "overview": "In the criminal justice system, sexually-based offenses are considered especially heinous. In New York City, the dedicated detectives who investigate these vicious felonies are members of an elite squad known as the Special Victims Unit. These are their stories.",
    "posterPath": "/iofokHZoUB4Qhik4PflvJl8TT6a.jpg",
    "backdropPath": "/obtdxPgmfykYwVnvuYXC5f2xKlQ.jpg",
    "releaseDate": "1999-09-20",
    "voteAverage": 8,
    "voteCount": 4362,
    "genreIds": [
      80,
      18,
      9648
    ],
    "popularity": 566,
    "originalLanguage": "en",
    "trailerKey": "MhGI_1DIhxw",
    "seasonEpisodeCounts": [
      22,
      21,
      23,
      25,
      25,
      23
    ]
  },
  {
    "id": 59941,
    "mediaType": "tv",
    "title": "The Tonight Show Starring Jimmy Fallon",
    "overview": "After Jay Leno's second retirement from the program, Jimmy Fallon stepped in as his permanent replacement. After 42 years in Los Angeles the program was brought back to New York.",
    "posterPath": "/1N4o5PmmqhlVDrcdJ2RlCFWbLGX.jpg",
    "backdropPath": "/i4OYRb5V13BrOnTPJGdyXWg4r0J.jpg",
    "releaseDate": "2014-02-17",
    "voteAverage": 5.8,
    "voteCount": 391,
    "genreIds": [
      35,
      10767
    ],
    "popularity": 588,
    "originalLanguage": "en",
    "trailerKey": "q-0YafsWK_M",
    "seasonEpisodeCounts": [
      191,
      263,
      144,
      208,
      190,
      194
    ]
  },
  {
    "id": 108978,
    "mediaType": "tv",
    "title": "Reacher",
    "overview": "Jack Reacher, a veteran military police investigator, has just recently entered civilian life. Reacher is a drifter, carrying no phone and the barest of essentials as he travels the country and explores the nation he once served.",
    "posterPath": "/f1VCQIG2iCyOookdgOzwtUpwWC0.jpg",
    "backdropPath": "/pF0qkRsrHkdYadPWY9AMeFZfcwk.jpg",
    "releaseDate": "2022-02-03",
    "voteAverage": 8.1,
    "voteCount": 3435,
    "genreIds": [
      10759,
      80
    ],
    "popularity": 603,
    "originalLanguage": "en",
    "trailerKey": "GSycMV-_Csw",
    "seasonEpisodeCounts": [
      8,
      8,
      8,
      8
    ]
  },
  {
    "id": 2261,
    "mediaType": "tv",
    "title": "The Tonight Show Starring Johnny Carson",
    "overview": "The Tonight Show Starring Johnny Carson is a talk show hosted by Johnny Carson under The Tonight Show franchise from 1962 to 1992. It originally aired during late-night. For its first ten years, Carson's Tonight Show was based in New York City with occasional trips to Burbank, California; in May 1972, the show moved permanently to Burbank, California. In 2002, The Tonight Show Starring Johnny Carson was ranked #12 on TV Guide's 50 Greatest TV Shows of All Time.",
    "posterPath": "/uSvET5YUvHNDIeoCpErrbSmasFb.jpg",
    "backdropPath": "/qFfWFwfaEHzDLWLuttWiYq7Poy2.jpg",
    "releaseDate": "1962-10-01",
    "voteAverage": 7.6,
    "voteCount": 97,
    "genreIds": [
      10767
    ],
    "popularity": 554,
    "originalLanguage": "en",
    "trailerKey": "zyl4Vvjc7pI",
    "seasonEpisodeCounts": [
      64,
      258,
      257,
      258,
      256,
      252
    ]
  },
  {
    "id": 549,
    "mediaType": "tv",
    "title": "Law & Order",
    "overview": "In cases ripped from the headlines, police investigate serious and often deadly crimes, weighing the evidence and questioning the suspects until someone is taken into custody. The district attorney's office then builds a case to convict the perpetrator by proving the person guilty beyond a reasonable doubt. Working together, these expert teams navigate all sides of the complex criminal justice system to make New York a safer place.",
    "posterPath": "/haJ9eHytVO3H3JooMJG1DiWwDNm.jpg",
    "backdropPath": "/tc7canPSAn2X14hYi6Rl3gZm1o4.jpg",
    "releaseDate": "1990-09-13",
    "voteAverage": 7.3,
    "voteCount": 729,
    "genreIds": [
      80,
      18
    ],
    "popularity": 458,
    "originalLanguage": "en",
    "trailerKey": "RzN8cPlcMTU",
    "seasonEpisodeCounts": [
      22,
      22,
      22,
      22,
      23,
      23
    ]
  }
];

export const featuredCollections: Collection[] = [
  { id: "blockbusters", name: "Blockbusters", tagline: "Big screen. Bigger stakes.", genreId: 28, gradient: "from-red-600/80 via-red-900/40" },
  { id: "sci-fi", name: "Sci-Fi Universe", tagline: "Worlds beyond imagination", genreId: 878, gradient: "from-blue-600/80 via-indigo-900/40" },
  { id: "animation", name: "Family & Animation", tagline: "Stories for every age", genreId: 16, gradient: "from-amber-500/80 via-orange-900/40" },
  { id: "thrillers", name: "Edge of Your Seat", tagline: "Thrillers that grip", genreId: 53, gradient: "from-violet-600/80 via-purple-900/40" },
  { id: "horror", name: "After Dark", tagline: "Lights off. Volume up.", genreId: 27, gradient: "from-emerald-600/80 via-emerald-950/40" },
  { id: "comedy", name: "Feel Good", tagline: "Laugh out loud", genreId: 35, gradient: "from-pink-500/80 via-fuchsia-900/40" },
];
