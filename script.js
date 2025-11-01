// Music player functionality
let isMusicPlaying = false;
let currentTrack = 0;
const audio = document.getElementById('background-music');

// Romantic music tracks (using local files from music folder)
const musicTracks = [
    {
        name: "💕 It's You - Ali Gatie",
        url: "music/Ali_Gatie_-_It's_You_(Official_Lyrics_Video).mp3",
        duration: "3:32"
    },
    {
        name: "🎵 Perfect - Ed Sheeran",
        url: "music/Ed_Sheeran_-_Perfect_(Official_Music_Video).mp3",
        duration: "4:23"
    },
    {
        name: "💖 Die With A Smile - Lady Gaga & Bruno Mars",
        url: "music/Lady Gaga_ Bruno Mars - Die With A Smile (Official Music Video)(MP3_160K).mp3",
        duration: "4:11"
    },
    {
        name: "💕 Blue - yung kai",
        url: "music/yung kai - blue (Official Audio)(MP3_160K).mp3",
        duration: "2:59"
    },
    {
        name: "🌹 Behos - Sushant KC",
        url: "music/Sushant_KC_-_Behos(256k).mp3",
        duration: "4:15"
    },
    {
        name: "🦋 Jhim Jhimaune Aankha - EKDEV LIMBU",
        url: "music/EKDEV LIMBU - Jhim Jhimaune Aankha [Official Music Video](MP3_160K).mp3",
        duration: "3:45"
    },
    {
        name: "💑 Kasari Bhanu - Swoopna Suman",
        url: "music/Kasari_Bhanu_-_Official_Lyrical_Video_-_Swoopna_Suman_-_Arbitrary_Originals(128kbps).mp3",
        duration: "4:02"
    }
    // You can add more romantic songs here:
    // {
    //     name: "🌹 Make You Feel My Love - Adele",
    //     url: "music/make_you_feel_my_love.mp3",
    //     duration: "3:32"
    // },
    // {
    //     name: "💓 Endless Love - Lionel Richie & Diana Ross",
    //     url: "music/endless_love.mp3",
    //     duration: "4:25"
    // }
];

function initializeMusicPlayer() {
    try {
        // Set up audio element
        setupAudioElement();

        // Update music player UI
        updateMusicPlayerUI();

        // Set up progress tracking
        setupProgressTracking();

        // Set initial music state to paused (don't auto-play on page load)
        isMusicPlaying = false;

        // Initialize track counter
        currentTrack = 0;

        // Show/hide track navigation based on number of tracks
        const trackInfo = document.querySelector('.track-info');
        if (trackInfo) {
            if (musicTracks.length > 1) {
                trackInfo.style.display = 'flex';
                trackInfo.classList.remove('hidden');
            } else {
                trackInfo.style.display = 'none';
                trackInfo.classList.add('hidden');
            }
        }

        updateMusicPlayerUI();

        console.log('🎵 Music player initialized successfully (paused state)');
        console.log('📀 Loaded', musicTracks.length, 'romantic tracks for the birthday playlist');

        // Show playlist details
        console.log('🎵 Available tracks:');
        musicTracks.forEach((track, index) => {
            console.log(`   ${index + 1}. ${track.name} (${track.duration})`);
        });
        console.log('💡 Click "Begin Your Special Journey" to start music and videos!');
    } catch (error) {
        console.error('Error initializing music player:', error);
    }
}

function setupAudioElement() {
    // Set up audio event listeners
    audio.addEventListener('loadedmetadata', function() {
        updateDuration();
    });

    audio.addEventListener('timeupdate', function() {
        updateProgress();
    });

    audio.addEventListener('ended', function() {
        // Play next track or loop current
        playNextTrack();
    });

    audio.addEventListener('error', function() {
        console.log('Audio error - music file not found or not supported');
        // Show user-friendly message instead of just console log
        showModal('💕 Music Setup', 'The romantic birthday music couldn\'t be loaded. Please make sure the music files are in the correct folder and try refreshing the page. You can still enjoy all the other beautiful features of this birthday experience! 💖');
    });

    // Load the first track
    if (musicTracks.length > 0) {
        loadTrack(0);
    }
}

function toggleMusic() {
    try {
        if (isMusicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    } catch (error) {
        console.error('Error toggling music:', error);
        showMusicInstructions();
    }
}

function playMusic() {
    try {
        console.log('🎵 Attempting to play music...');
        audio.play().then(() => {
            isMusicPlaying = true;
            updateMusicPlayerUI();

            // Add a subtle animation to the now-playing text
            const nowPlaying = document.getElementById('now-playing');
            if (nowPlaying) {
                nowPlaying.style.animation = 'none';
                setTimeout(() => {
                    nowPlaying.style.animation = 'gentleBeat 2s ease-in-out infinite';
                }, 100);
            }

            console.log('✅ Music started playing successfully');
            console.log('🎶 Now playing:', musicTracks[currentTrack]?.name || 'Unknown track');
            console.log('📊 Track progress: 1/' + musicTracks.length);
        }).catch(error => {
            console.error('❌ Error playing music:', error);
            isMusicPlaying = false;
            updateMusicPlayerUI();

            // Remove animation if playback fails
            const nowPlaying = document.getElementById('now-playing');
            if (nowPlaying) {
                nowPlaying.style.animation = 'none';
            }

        });
    } catch (error) {
        console.error('❌ Error in playMusic:', error);
        isMusicPlaying = false;
        updateMusicPlayerUI();
    }
}

function pauseMusic() {
    try {
        console.log('⏸️ Pausing music...');
        audio.pause();
        isMusicPlaying = false;

        // Remove animation when paused
        const nowPlaying = document.getElementById('now-playing');
        if (nowPlaying) {
            nowPlaying.style.animation = 'none';
        }

        updateMusicPlayerUI();
        console.log('✅ Music paused successfully');
    } catch (error) {
        console.error('❌ Error pausing music:', error);
        isMusicPlaying = false;
        updateMusicPlayerUI();
    }
}

function setVolume(volume) {
    try {
        audio.volume = volume;
        updateVolumeIcon(volume);
    } catch (error) {
        console.error('Error setting volume:', error);
    }
}

function updateVolumeIcon(volume) {
    const volumeIcon = document.querySelector('.volume-icon');
    if (volumeIcon) {
        if (volume === 0) {
            volumeIcon.textContent = '🔇';
        } else if (volume < 0.3) {
            volumeIcon.textContent = '🔈';
        } else if (volume < 0.7) {
            volumeIcon.textContent = '🔉';
        } else {
            volumeIcon.textContent = '🔊';
        }
    }
}

function setupProgressTracking() {
    // Make progress bar clickable
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.addEventListener('click', function(e) {
            try {
                const rect = progressBar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = clickX / rect.width;
                const newTime = percentage * audio.duration;

                if (!isNaN(newTime)) {
                    audio.currentTime = newTime;
                }
            } catch (error) {
                console.error('Error seeking audio:', error);
            }
        });
    }
}

function updateProgress() {
    try {
        if (audio.duration && !isNaN(audio.duration)) {
            const progress = (audio.currentTime / audio.duration) * 100;
            const progressFill = document.getElementById('progress-fill');

            if (progressFill) {
                progressFill.style.width = progress + '%';
            }

            // Update time display
            updateCurrentTime();
        }
    } catch (error) {
        console.error('Error updating progress:', error);
    }
}

function updateCurrentTime() {
    try {
        const currentTimeElement = document.getElementById('current-time');
        const durationElement = document.getElementById('duration');

        if (currentTimeElement && durationElement) {
            currentTimeElement.textContent = formatTime(audio.currentTime);
            durationElement.textContent = formatTime(audio.duration);
        }
    } catch (error) {
        console.error('Error updating time display:', error);
    }
}

function updateDuration() {
    try {
        const durationElement = document.getElementById('duration');
        if (durationElement && !isNaN(audio.duration)) {
            durationElement.textContent = formatTime(audio.duration);
        }
    } catch (error) {
        console.error('Error updating duration:', error);
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateMusicPlayerUI() {
    try {
        const musicBtn = document.getElementById('music-toggle');
        const musicText = musicBtn.querySelector('.music-text');
        const musicIcon = musicBtn.querySelector('.music-icon');
        const nowPlaying = document.getElementById('now-playing');
        const trackCounter = document.getElementById('track-counter');
        const prevBtn = document.getElementById('prev-track');
        const nextBtn = document.getElementById('next-track');

        if (musicBtn && musicText && musicIcon && nowPlaying) {
            if (isMusicPlaying) {
                musicBtn.classList.add('playing');
                musicIcon.textContent = '⏸️';

                if (musicTracks[currentTrack]) {
                    nowPlaying.textContent = musicTracks[currentTrack].name;
                } else {
                    nowPlaying.textContent = '💕 Romantic Birthday Music';
                }
            } else {
                musicBtn.classList.remove('playing');
                musicIcon.textContent = '🎵';
                nowPlaying.textContent = '💕 Romantic Birthday Music';
            }

            // Update track counter
            if (trackCounter && musicTracks.length > 0) {
                trackCounter.textContent = `${currentTrack + 1}/${musicTracks.length}`;
            }

            // Update track navigation buttons
            if (prevBtn) {
                prevBtn.style.opacity = musicTracks.length > 1 ? '1' : '0.5';
                prevBtn.style.pointerEvents = musicTracks.length > 1 ? 'auto' : 'none';
            }
            if (nextBtn) {
                nextBtn.style.opacity = musicTracks.length > 1 ? '1' : '0.5';
                nextBtn.style.pointerEvents = musicTracks.length > 1 ? 'auto' : 'none';
            }

            // Show/hide track info section
            const trackInfo = document.querySelector('.track-info');
            if (trackInfo) {
                if (musicTracks.length > 1) {
                    trackInfo.style.display = 'flex';
                    trackInfo.classList.remove('hidden');
                } else {
                    trackInfo.style.display = 'none';
                    trackInfo.classList.add('hidden');
                }
            }
        }
    } catch (error) {
        console.error('Error updating music player UI:', error);
    }
}

function playPreviousTrack() {
    try {
        const prevTrack = currentTrack === 0 ? musicTracks.length - 1 : currentTrack - 1;
        console.log('⏮️ Manually switching from track', currentTrack + 1, 'to track', prevTrack + 1);
        currentTrack = prevTrack;
        loadTrack(currentTrack);
    } catch (error) {
        console.error('❌ Error playing previous track:', error);
    }
}

function playNextTrack() {
    try {
        currentTrack = (currentTrack + 1) % musicTracks.length;
        loadTrack(currentTrack);
        console.log('⏭️ Playing next track:', musicTracks[currentTrack]?.name);
    } catch (error) {
        console.error('❌ Error playing next track:', error);
    }
}

function loadTrack(trackIndex) {
    try {
        if (musicTracks[trackIndex] && musicTracks[trackIndex].url) {
            console.log('🔄 Loading track', trackIndex + 1 + ':', musicTracks[trackIndex].name);
            audio.src = musicTracks[trackIndex].url;
            audio.load();

            // Update current track
            currentTrack = trackIndex;

            // Update UI immediately (before playing)
            updateMusicPlayerUI();

            // Start playing the new track
            playMusic();
        } else {
            console.error('❌ Invalid track index or missing URL:', trackIndex);
        }
    } catch (error) {
        console.error('❌ Error loading track:', error);
    }
}

function playNextTrack() {
    try {
        const nextTrack = (currentTrack + 1) % musicTracks.length;
        console.log('⏭️ Auto-advancing from track', currentTrack + 1, 'to track', nextTrack + 1);
        currentTrack = nextTrack;
        loadTrack(currentTrack);
    } catch (error) {
        console.error('❌ Error playing next track:', error);
    }
}

function showMusicInstructions() {
    try {
        const modal = document.getElementById('music-instructions-modal');
        if (modal) {
            modal.style.display = 'block';

            // Animate modal entrance
            if (typeof gsap !== 'undefined') {
                gsap.from('.music-instructions-modal .modal-content', {
                    duration: 0.3,
                    scale: 0.8,
                    opacity: 0,
                    y: 50,
                    ease: 'back.out(1.7)'
                });
            }
        }
    } catch (error) {
        console.error('Error showing music instructions:', error);
    }
}

function closeMusicInstructions() {
    try {
        const modal = document.getElementById('music-instructions-modal');
        if (modal) {
            if (typeof gsap !== 'undefined') {
                gsap.to('.music-instructions-modal .modal-content', {
                    duration: 0.3,
                    scale: 0.8,
                    opacity: 0,
                    y: 50,
                    ease: 'power3.in',
                    onComplete: () => {
                        modal.style.display = 'none';
                        gsap.set('.music-instructions-modal .modal-content', { scale: 1, opacity: 1, y: 0 });
                    }
                });
            } else {
                modal.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error closing music instructions:', error);
    }
}

function createFloatingHearts() {
    try {
        const heartsContainer = document.querySelector('.floating-hearts');

        if (!heartsContainer) {
            console.log('Floating hearts container not found');
            return;
        }

        for (let i = 0; i < 20; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = '💕';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDelay = Math.random() * 6 + 's';
            heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
            heartsContainer.appendChild(heart);
        }

        console.log('Floating hearts created successfully'); // Debug log
    } catch (error) {
        console.error('Error creating floating hearts:', error);
    }
}

function initializeAnimations() {
    // Check if GSAP is available
    if (typeof gsap !== 'undefined') {
        // Add entrance animations only if GSAP loaded successfully
        gsap.from('.hero-section', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });

        gsap.from('.birthday-title', {
            duration: 1.5,
            y: 30,
            opacity: 0,
            ease: 'back.out(1.7)',
            delay: 0.3
        });

        gsap.from('.romantic-message', {
            duration: 1,
            scale: 0.8,
            opacity: 0,
            ease: 'back.out(1.7)',
            delay: 0.8
        });

        gsap.fromTo('.start-journey-btn', {
            opacity: 1,
            y: 30,
            scale: 0.8
        }, {
            duration: 1,
            opacity: 1,
            y: 0,
            scale: 1,
            ease: 'back.out(1.7)',
            delay: 1.2
        });
    }
}

function startBirthdayJourney() {
    console.log('🚀 Starting the romantic birthday journey...');

    // Create fireworks and flowers burst effect
    createFireworksAndFlowers();

    // Hide hero section
    const heroSection = document.querySelector('.hero-section');
    const journeySection = document.querySelector('.journey-section');

    if (typeof gsap !== 'undefined') {
        gsap.to(heroSection, {
            duration: 0.8,
            scale: 0.8,
            opacity: 0,
            y: -50,
            ease: 'power3.in',
            onComplete: () => {
                console.log('✨ Hero section hidden, revealing journey...');
                heroSection.style.display = 'none';
                journeySection.classList.add('show');

                // Animate journey cards entrance
                gsap.from('.journey-card', {
                    duration: 0.6,
                    y: 50,
                    opacity: 0,
                    stagger: 0.2,
                    ease: 'power3.out',
                    onComplete: () => {
                        console.log('🎭 Journey animations completed');
                    }
                });

                // Start music and videos when journey begins (after user interaction)
                console.log('🎵 Triggering music and video autoplay...');
                startMusicOnJourney();
            }
        });
    } else {
        // Fallback without animations
        heroSection.style.display = 'none';
        journeySection.classList.add('show');

        console.log('🎵 Starting music and videos (no animations)...');
        // Start music and videos when journey begins (after user interaction)
        startMusicOnJourney();
    }
}

function startMusicOnJourney() {
    try {
        console.log('🎵 Starting romantic birthday music journey...');
        console.log('📀 Playlist:', musicTracks.length, 'tracks loaded');
        console.log('🎶 Starting with:', musicTracks[currentTrack]?.name || 'Romantic track');
        console.log('⏱️  Duration:', musicTracks[currentTrack]?.duration || 'Unknown');

        // Show playlist details
        console.log('🎵 Full playlist:');
        musicTracks.forEach((track, index) => {
            const isCurrent = index === currentTrack ? '🎵' : '   ';
            console.log(`${isCurrent} ${index + 1}. ${track.name} (${track.duration})`);
        });

        // Start playing music automatically
        playMusic();

        // Start playing all videos when journey begins (after user interaction)
        startAllVideos();

        // Show a notification that music has started
        console.log('✅ Romantic birthday music started automatically!');
        console.log('🎬 All memory videos starting...');

        // Update the now-playing text to show current track
        const nowPlaying = document.getElementById('now-playing');
        if (nowPlaying && musicTracks[currentTrack]) {
            nowPlaying.textContent = musicTracks[currentTrack].name;
            console.log('📱 Updated now-playing display:', musicTracks[currentTrack].name);
        }

        // Update music player UI to show playing state
        updateMusicPlayerUI();

        // Show a brief notification about the playlist
        setTimeout(() => {
            console.log('🎵 Playlist will automatically advance through', musicTracks.length, 'romantic tracks');
            console.log('🎮 Use ⏮️ and ⏭️ buttons to navigate tracks manually');
        }, 1000);

    } catch (error) {
        console.error('❌ Error auto-starting music:', error);
        // If auto-start fails, show music instructions modal
        showMusicInstructions();
    }
}



function startAllVideos() {
    try {
        const memoryVideos = document.querySelectorAll('.memory-video');
        console.log('Starting', memoryVideos.length, 'videos...');

        memoryVideos.forEach((video, index) => {
            // Set video attributes for autoplay and loop
            video.muted = true;
            video.loop = true;
            video.playsInline = true;

            // Ensure all source elements have preload
            const sources = video.querySelectorAll('source');
            sources.forEach(source => {
                source.preload = 'auto';
            });

            // Try to play each video only once
            if (!video.played) {
                video.played = true;
                video.play().then(() => {
                    console.log('✅ Video', index + 1, 'started successfully:', video.querySelector('source')?.src || video.src);
                    console.log('Video', index + 1, 'play info:', {
                        src: video.querySelector('source')?.src || video.src,
                        duration: video.duration || 'Unknown',
                        dimensions: `${video.videoWidth || 'Unknown'}x${video.videoHeight || 'Unknown'}`,
                        playMethod: 'Journey start trigger',
                        videoIndex: index + 1
                    });
                }).catch(e => {
                    console.log('❌ Video', index + 1, 'failed to start:', e.message);
                    console.error('Video', index + 1, 'error details:', {
                        code: e.code || 'Unknown',
                        name: e.name || 'Unknown',
                        message: e.message || 'No message',
                        fullError: e
                    });

                    // Show fallback immediately since autoplay failed
                    video.classList.add('no-video');
                    const gradients = [
                        'linear-gradient(135deg, #ff9a9e, #fecfef)',
                        'linear-gradient(135deg, #a8edea, #fed6e3)',
                        'linear-gradient(135deg, #d299c2, #fef9d7)',
                        'linear-gradient(135deg, #89f7fe, #66a6ff)',
                        'linear-gradient(135deg, #ffecd2, #fcb69f)',
                        'linear-gradient(135deg, #a18cd1, #fbc2eb)'
                    ];
                    video.parentElement.style.background = gradients[index] || gradients[0];
                    const overlay = video.nextElementSibling;
                    if (overlay) {
                        overlay.style.opacity = '1';
                        overlay.style.background = 'linear-gradient(135deg, rgba(233, 30, 99, 0.8), rgba(156, 39, 176, 0.7))';
                        // Show the play button for manual playback
                        const playBtn = overlay.querySelector('.play-btn');
                        if (playBtn) {
                            playBtn.style.display = 'block';
                        }
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error starting videos:', error);
    }
}

function showMemory(memoryType) {
    const memories = {
        'first-meet': {
            title: '💕 The Day We Met',
            message: 'The day I met you was the day my life changed forever. Your smile lit up the room, your voice was like music to my ears, and I knew from that moment that you were someone special. You captured my heart from the very first hello.'
        },
        'first-date': {
            title: '🦋 Our First Date',
            message: 'Our first date was magical - the way you smiled, the way we talked for hours, the butterflies in my stomach. I knew then that you were the one.'
        },
        'first-kiss': {
            title: '💋 First Kiss',
            message: 'That first kiss was electric! The world stopped for a moment and I knew I never wanted to let you go. You are my forever.'
        },
        'adventures': {
            title: '🗺️ Our Adventures',
            message: 'Every adventure with you has been amazing. From spontaneous road trips to quiet walks, every moment has been filled with love and discovery.'
        },
        'laughter': {
            title: '😂 Endless Laughter',
            message: 'Your laugh is my favorite sound in the world. The way we can make each other smile and laugh together creates the most beautiful memories.'
        },
        'future': {
            title: '⭐ Our Future Together',
            message: 'I cannot wait to create many more beautiful memories with you. Every day with you is a gift, and I am so excited for our future together.'
        }
    };

    const memory = memories[memoryType];
    if (memory) {
        console.log('Showing memory:', memoryType); // Debug log
        showModal(memory.title, memory.message);
    } else {
        console.log('Memory not found:', memoryType); // Debug log
    }
}

function revealWish(wishNumber) {
    const wishes = [
        "🌟 May all your dreams come true and your heart be filled with endless joy!",
        "🎂 On this special day, I wish you success in everything you do and love in everything you are!",
        "💕 May your birthday be as beautiful and amazing as you are, my love!"
    ];

    const wish = wishes[wishNumber - 1];
    const revealedWishes = document.getElementById('revealed-wishes');

    const wishElement = document.createElement('div');
    wishElement.className = 'revealed-wish';
    wishElement.innerHTML = `<strong>Wish ${wishNumber}:</strong> ${wish}`;

    revealedWishes.appendChild(wishElement);

    // Animate the revealed wish only if GSAP is available
    if (typeof gsap !== 'undefined') {
        gsap.from(wishElement, {
            duration: 0.5,
            scale: 0,
            rotation: -10,
            ease: 'back.out(1.7)'
        });
    }
}

function openSurprise() {
    console.log('Opening surprise...');
    const surpriseContent = document.querySelector('.surprise-content');
    const surpriseBox = document.querySelector('.surprise-box');
    const giftBox = document.querySelector('.gift-box');
    const giftLid = document.querySelector('.gift-lid');
    const giftBow = document.querySelector('.gift-bow');
    const giftBoxTop = document.querySelector('.gift-box-top');
    const giftBoxBottom = document.querySelector('.gift-box-bottom');

    if (surpriseBox.classList.contains('opened')) {
        console.log('Surprise already opened');
        return; // Already opened
    }
    
    console.log('Adding opened class to surprise box');
    surpriseBox.classList.add('opened');

    // Disable further clicks during animation
    surpriseBox.style.pointerEvents = 'none';
    
    // Show the surprise content container
    if (surpriseContent) {
        console.log('Making surprise content visible');
        surpriseContent.classList.add('visible');
    }

    if (typeof gsap !== 'undefined') {
        // Step 1: Initial lift up animation
        gsap.to(surpriseBox, {
            duration: 0.5,
            y: -30,
            scale: 1.1,
            rotation: -5,
            transformOrigin: 'center bottom',
            ease: 'back.out(1.7)',
            onComplete: function() {
                // Step 2: Shake effect
                const shakeTL = gsap.timeline();
                shakeTL.to(surpriseBox, {
                    duration: 0.1,
                    x: 10,
                    y: 0,
                    rotation: 5,
                    transformOrigin: 'center bottom',
                    ease: 'power1.inOut'
                });
                shakeTL.to(surpriseBox, {
                    duration: 0.1,
                    x: -10,
                    y: -5,
                    rotation: -5,
                    transformOrigin: 'center bottom',
                    ease: 'power1.inOut'
                });
                shakeTL.to(surpriseBox, {
                    duration: 0.1,
                    x: 5,
                    y: 0,
                    rotation: 0,
                    transformOrigin: 'center bottom',
                    ease: 'power1.inOut',
                    onComplete: function() {
                        // Step 3: Box opening animation
                        gsap.to(giftLid, {
                            duration: 0.5,
                            y: -50,
                            rotationX: 45,
                            transformOrigin: 'bottom center',
                            ease: 'power2.inOut',
                            onComplete: function() {
                                // Create burst effect
                                createBurstEffect(surpriseBox);
                                
                                // Hide the box with style
                                gsap.to([giftBox, giftLid, giftBow, giftBoxTop, giftBoxBottom], {
                                    duration: 0.5,
            opacity: 0,
                                    scale: 0,
                                    rotation: 180,
                                    ease: 'back.in(1.7)',
                                    onComplete: function() {
                                        // Show the cake and letter inside the existing .birthday-surprise/journey-card
                                        showCakeWithCandle();
                                        // (No moving surpriseContent to document.body)
                                        // Keep .surprise-content scrollable, in place
                                        const surpriseContent = document.getElementById('surprise-content');
                                        if(surpriseContent) {
                                            surpriseContent.style.position = 'static';
                                            surpriseContent.style.width = '100%';
                                            surpriseContent.style.height = 'auto';
                surpriseContent.style.display = 'block';
                                            surpriseContent.style.zIndex = '';
                                            surpriseContent.style.padding = '20px 8px';
                                            surpriseContent.style.overflowY = 'visible';
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    } else {
        // Fallback for browsers without GSAP
        surpriseBox.style.display = 'none';
        showCakeWithCandle();
    }
}

// Removed old banner/standalone letter flow; letter is now shown beside cake

function createBurstEffect(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const confettiColors = ['#FF6B9D', '#E91E63', '#FFD700', '#4CAF50', '#FF9800', '#9C27B0'];
    const ribbons = ['🎀', '🎊', '🎉', '✨', '⭐', '💫'];
    
    // Create confetti burst
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.left = centerX + 'px';
            confetti.style.top = centerY + 'px';
            confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '10001';
            confetti.style.pointerEvents = 'none';
            
            if (typeof gsap !== 'undefined') {
                const angle = (Math.PI * 2 * i) / 50;
                const distance = 150 + Math.random() * 200;
                gsap.to(confetti, {
                    duration: 1 + Math.random(),
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: 0,
                    scale: 0,
                    ease: 'power2.out',
                    onComplete: () => confetti.remove()
                });
            }
            document.body.appendChild(confetti);
        }, i * 10);
    }
    
    // Create ribbon burst
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const ribbon = document.createElement('div');
            ribbon.textContent = ribbons[Math.floor(Math.random() * ribbons.length)];
            ribbon.style.position = 'fixed';
            ribbon.style.left = centerX + 'px';
            ribbon.style.top = centerY + 'px';
            ribbon.style.fontSize = (Math.random() * 20 + 20) + 'px';
            ribbon.style.zIndex = '10002';
            ribbon.style.pointerEvents = 'none';
            
            if (typeof gsap !== 'undefined') {
                const angle = (Math.PI * 2 * i) / 15;
                const distance = 100 + Math.random() * 150;
                gsap.to(ribbon, {
                    duration: 1.5,
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: 0,
                    rotation: Math.random() * 720,
                    scale: 2,
                    ease: 'power2.out',
                    onComplete: () => ribbon.remove()
                });
            }
            document.body.appendChild(ribbon);
        }, i * 30);
    }
}

function showCakeWithCandle() {
    console.log('Showing cake with candles...');
    const surpriseContent = document.querySelector('.surprise-content');
    if (!surpriseContent) {
        console.error('Surprise content container not found!');
        return;
    }
    
    // Make sure the content is visible
    surpriseContent.classList.add('visible');
    surpriseContent.style.display = 'flex';
    
    // No banner; we show the cake and letter together
    
    // Modern cake design with elegant styling, plus letter side-by-side
                surpriseContent.innerHTML = `
      <div class="falling-birthday-banner">🎉 Happy Birthday Maya! 🎉</div>
      <div class="cake-letter-row">
        <div class="cake-container">
            <div class="make-a-wish">✨ Make a Wish ✨</div>
            <div class="blow-hint">Click the cake to blow out the candles</div>
            
            <!-- Modern Cake Stand -->
            <div class="cake-stand">
                <div class="stand-base"></div>
                <div class="stand-pedestal"></div>
                <div class="stand-top"></div>
            </div>
            
            <!-- The Cake -->
            <div class="cake" id="cake" onclick="if(!this.classList.contains('blown')) { blowAllCandles(); this.classList.add('blown'); }">
                <!-- Cake Layers -->
                <div class="cake-layers">
                    <!-- Bottom Layer -->
                    <div class="cake-layer bottom-layer">
                        <div class="cake-frosting">
                            <div class="cake-shine"></div>
                            <div class="cake-drip"></div>
                        </div>
                    </div>
                    
                    <!-- Middle Layer -->
                    <div class="cake-layer middle-layer">
                        <div class="cake-frosting">
                            <div class="cake-shine"></div>
                            <div class="cake-drip"></div>
                        </div>
                    </div>
                    
                    <!-- Top Layer -->
                    <div class="cake-layer top-layer">
                        <div class="cake-frosting">
                            <div class="cake-shine"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Modern Decorative Elements -->
                <div class="cake-decorations">
                    <!-- Gold Accents -->
                    <div class="gold-accent"></div>
                    
                    <!-- Sprinkles -->
                    <div class="sprinkles">
                        ${Array(15).fill().map(() => {
                            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
                            const color = colors[Math.floor(Math.random() * colors.length)];
                            return `
                            <div class="sprinkle" style="
                                left: ${Math.random() * 100}%;
                                top: ${10 + Math.random() * 80}%;
                                background: ${color};
                                transform: rotate(${Math.random() * 360}deg);
                                width: ${3 + Math.random() * 4}px;
                                height: ${3 + Math.random() * 4}px;
                                animation-delay: ${Math.random() * 2}s;
                            "></div>`;
                        }).join('')}
                    </div>
                </div>
                
                <!-- Elegant Candles -->
                <div class="candles" id="candles">
                    ${Array(5).fill().map((_, i) => {
                        const delay = i * 0.15;
                        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
                        const color = colors[i % colors.length];
                        return `
                        <div class="candle" style="--delay: ${delay}s; --candle-color: ${color}">
                            <div class="candle-wax">
                                <div class="wax-drip" style="--drip-delay: ${1 + Math.random() * 2}s"></div>
                            </div>
                            <div class="flame-holder">
                                <div class="flame">
                                    <div class="flame-inner"></div>
                                    <div class="glow"></div>
                                    <div class="sparkles">
                                        ${Array(3).fill().map(() => 
                                            `<div class="sparkle" style="
                                                --sparkle-size: ${1 + Math.random() * 2}px;
                                                --sparkle-x: ${-3 + Math.random() * 6}px;
                                                --sparkle-y: ${-3 + Math.random() * 3}px;
                                                --sparkle-delay: ${Math.random() * 0.5}s;
                                                --sparkle-duration: ${0.5 + Math.random() * 1}s;
                                            "></div>`
                                        ).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
                        ${Array(20).fill().map(() => 
                            `<div class="sprinkle" style="
                                position: absolute;
                                width: 6px;
                                height: 6px;
                                background: ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeead', '#ffcc5c', '#ff6f69'][Math.floor(Math.random() * 7)]};
                                border-radius: 50%;
                                left: ${10 + Math.random() * 80}%;
                                top: ${10 + Math.random() * 60}%;
                                transform: rotate(${Math.random() * 360}deg);
                            "></div>`
                        ).join('')}
                    </div>
                </div>
                
                <!-- Candles -->
                <div class="candles" id="candles">
                    ${Array(5).fill().map(() => `
                        <div class="candle">
                            <div class="melt"></div>
                            <div class="light-reflection"></div>
                            <div class="flame"></div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Final Letter (visible alongside the cake) -->
            <div class="final-letter-container" id="final-letter" style="display: block;">
                <div class="letter-paper final-letter">
                    <div class="letter-header">
                        <div class="letter-date">November 2nd, 2025</div>
                        <div class="letter-decoration">✨💕✨</div>
                    </div>
                    <div class="letter-content">
                        <p>My Dearest Love,</p>
                        <p>On this special day, I want to express how grateful I am to have you in my life. You are the most beautiful person I know, inside and out.</p>
                        <p>Every moment with you is a gift. Your smile lights up my world, your laughter is music to my ears, and your love is my greatest treasure.</p>
                        <p><strong>You make every day worth celebrating, not just today, but every day of the year.</strong></p>
                        <p>My wish for you on this birthday is that all your dreams come true, that happiness follows you everywhere, and that you always know how deeply you are loved.</p>
                        <p>Thank you for being you. Thank you for being mine.</p>
                        <div class="letter-signature">
                            <p>With all my love, forever and always,<br>Your devoted partner 💕</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Love Video -->
            <div class="love-video-container">
                <h3 class="video-title">A Special Moment for You 💝</h3>
                <video class="love-video" controls>
                    <source src="vid/lov.mp4" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <p class="video-message">This is my love for you, growing stronger every day ❤️</p>
            </div>
        </div>
    `;

    // Arrange cake and letter side-by-side
    try {
        surpriseContent.style.display = 'flex';
        surpriseContent.style.flexDirection = 'row';
        surpriseContent.style.alignItems = 'flex-start';
        surpriseContent.style.justifyContent = 'center';
        surpriseContent.style.gap = '2rem';
        surpriseContent.style.flexWrap = 'wrap';
    } catch (e) {}
    
    // Animate cake entrance with GSAP
    if (typeof gsap !== 'undefined') {
        // Reset initial states
        gsap.set('.cake', { scale: 0.5, opacity: 0, y: 100 });
        gsap.set('.make-a-wish', { opacity: 0, y: -30 });
        gsap.set('.cake-stand', { scale: 0.8, opacity: 0 });
        gsap.set('.candle', { y: -50, opacity: 0, scale: 0.5 });
        gsap.set('.flame', { opacity: 0, scale: 0.5 });
        gsap.set('.sprinkle', { opacity: 0 });

        // Create timeline for sequential animations
        const tl = gsap.timeline();

        // Cake stand animation
        tl.to('.cake-stand', {
                    duration: 0.8,
            scale: 1,
            opacity: 1,
                    ease: 'back.out(1.7)'
                });

        // Cake base animation
        tl.to('.cake', {
            duration: 0.8,
            scale: 1,
            opacity: 1,
            y: 0,
            ease: 'back.out(1.7)'
        }, '-=0.3');

        // Cake icing animation
        tl.fromTo('.cake-icing', 
            { y: -30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' }
        );

        // Cake drip animation
        tl.fromTo('.cake-drip', 
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
        );

        // Candles animation
        tl.to('.candle', {
                    duration: 0.6,
            y: 0,
            opacity: 1,
            scale: 1,
                    stagger: 0.1,
            ease: 'back.out(1.7)'
        }, '-=0.3');

        // Flames animation
        tl.to('.flame', {
            duration: 0.5,
            opacity: 1,
            scale: 1,
            stagger: 0.1,
            ease: 'power2.out'
        }, '-=0.4');

        // Sprinkles animation
        tl.to('.sprinkle', {
            duration: 0.8,
            opacity: 1,
            stagger: 0.02,
            ease: 'sine.inOut'
        }, '-=0.3');

        // Make-a-wish text animation
        tl.to('.make-a-wish', {
            duration: 0.8,
            opacity: 1,
            y: 0,
            ease: 'back.out(1.7)'
        }, '-=0.5');

        // Continuous flame flicker animation
        gsap.to('.flame', {
            duration: 0.5,
            scale: () => 0.8 + Math.random() * 0.4,
            x: () => -2 + Math.random() * 4,
            y: () => -2 + Math.random() * 2,
            rotation: () => -5 + Math.random() * 10,
            transformOrigin: 'center bottom',
            ease: 'sine.inOut',
            repeat: -1,
            repeatRefresh: true,
            yoyo: true
        });

        // Subtle cake movement
        gsap.to('.cake', {
            duration: 8,
            rotation: 1,
            y: -5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });

        // Animate letter entrance
        gsap.from('#final-letter .final-letter', {
            duration: 0.8,
            opacity: 0,
            x: 40,
            scale: 0.95,
            ease: 'power3.out',
            delay: 0.6
        });
    }
}

function createFallingText(text) {
    return text.split('').map(char => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        // Random initial position and rotation
        const startX = (Math.random() - 0.5) * 100;
        const startRot = -30 + Math.random() * 60;
        span.style.transform = `translate(${startX}vw, -100vh) rotate(${startRot}deg)`;
        span.style.opacity = '0';
        span.style.transition = `all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${0.1 + Math.random() * 0.5}s`;
        return span;
    });
}

// Removed banner flow – letter is now shown alongside cake

function blowAllCandles() {
    try {
        const cake = document.getElementById('cake');
        const candles = document.querySelectorAll('.candle:not(.blown)');
        const finalLetter = document.getElementById('final-letter');
        
        if (candles.length === 0) {
            // Nothing to blow; ensure letter is visible and give a gentle pulse
            if (finalLetter) {
                finalLetter.style.display = 'block';
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(finalLetter, { scale: 0.98, opacity: 0.9 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' });
                }
            }
            return;
        }
    
    // Add wind effect to all flames
    gsap.to('.flame', {
        x: 30,
        opacity: 0.5,
        scale: 0.3,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.1
    });
    
    // Blow out each candle with a slight delay
    candles.forEach((candle, index) => {
        setTimeout(() => {
            // Get the flame for this specific candle
            const flame = candle.querySelector('.flame');
            
            // Mark candle as blown
            candle.classList.add('blown');
            
            // Create smoke effect
            const smoke = document.createElement('div');
            smoke.className = 'smoke';
            const flameHolder = candle.querySelector('.flame-holder');
            if (flameHolder) {
                flameHolder.appendChild(smoke);
            }
            
            // Animate smoke
            if (smoke) {
                gsap.fromTo(smoke,
                    { opacity: 1, y: 0, scale: 0.5 },
                    { 
                        opacity: 0, 
                        y: -50, 
                        scale: 1.5, 
                        duration: 2,
                        onComplete: () => {
                            if (smoke.parentNode) {
                                smoke.parentNode.removeChild(smoke);
                            }
                        }
                    }
                );
            }
            
            // Animate flame out
            if (flame) {
                gsap.to(flame, {
                    duration: 0.5,
                    opacity: 0,
                    scale: 0,
                    rotation: 360,
                    ease: 'power2.out',
                    onComplete: () => {
                        flame.style.display = 'none';
                    }
                });
            }
            
            // Add blow animation to candle
            gsap.to(candle, {
                duration: 0.3,
                x: -10,
                y: 10,
                repeat: 3,
                yoyo: true,
                ease: 'power1.inOut'
            });
            
            // Check if this was the last candle
            if (index === candles.length - 1) {
                cake.classList.add('all-blown');
                
                // Animate cake being "blown" - scale down and up
                gsap.to(cake, {
                    duration: 0.8,
                    scale: 1.1,
                    yoyo: true,
                    repeat: 1,
                    ease: 'back.out(1.7)',
                    onComplete: () => {
                // Show confetti and highlight the letter (already visible)
                createConfetti();
                        
                // Emphasize the letter after a short delay
                setTimeout(() => {
                    if (finalLetter) {
                        finalLetter.style.display = 'block';
                        if (typeof gsap !== 'undefined') {
                            gsap.fromTo(finalLetter, 
                                { opacity: 0, y: 30 },
                                { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' }
                            );
                        }
                    }
                }, 800);
                    }
                });
            }
        }, index * 200); // Stagger the candle blow-out effect
    });
    } catch (error) {
        console.error('Error in blowAllCandles:', error);
        // Fallback: If there's an error, still try to show the banner
        showBirthdayBanner();
    }
}

function blowCandle() {
    createFireworksAndFlowers();
    const candle = document.getElementById('birthday-candle');
    const finalLetter = document.getElementById('final-letter');
    const cake = document.getElementById('cake');
    
    if (candle.classList.contains('blown')) return;
    candle.classList.add('blown');
    cake.classList.add('blown');
    
    // Hide flame
    const flame = candle.querySelector('.flame');
    
    if (typeof gsap !== 'undefined') {
        // Animate cake being "blown" - scale down and up
        gsap.to(cake, {
            duration: 0.8,
            scale: 1.1,
            yoyo: true,
            repeat: 1,
            ease: 'back.out(1.7)'
        });
        
        gsap.to(flame, {
            duration: 0.8,
            opacity: 0,
            scale: 0,
            rotation: 360,
            ease: 'power2.out',
            onComplete: () => {
                flame.style.display = 'none';
                
                // Show final letter
                finalLetter.style.display = 'block';
                
                gsap.from('.final-letter', {
                    duration: 1,
                    scale: 0,
                    opacity: 0,
                    y: 50,
                    ease: 'back.out(1.7)',
                    onComplete: () => {
                        // Create final confetti burst
                        createConfetti();
                    }
                });
            }
        });
        
        // Add blow animation to candle
        gsap.to(candle, {
            duration: 0.3,
            x: -10,
            y: 10,
            repeat: 3,
            yoyo: true,
            ease: 'power1.inOut'
        });
    } else {
        flame.style.display = 'none';
        finalLetter.style.display = 'block';
    }
}


// Handle missing videos and create beautiful placeholders
// COMPREHENSIVE VIDEO ERROR LOGGING SYSTEM
// Provides detailed error codes, messages, and debugging info similar to:
// const video = document.getElementById('myVideo');
// video.addEventListener('error', (e) => { console.error('Video error code:', video.error.code); });
//
// Features:
// - Detailed error codes and messages for all video failures
// - Loading progress tracking with buffering percentages
// - Video metadata logging (duration, dimensions)
//// - Multiple fallback attempts (autoplay, delayed autoplay, manual play)
// - Beautiful gradient placeholders when videos fail
// - Manual play buttons for user interaction
// - Console logging with emojis for easy debugging

function openEnvelope() {
    const envelope = document.getElementById('envelope');
    const envelopeFlap = document.getElementById('envelope-flap');
    const letterReveal = document.getElementById('letter-reveal');

    // Prevent multiple clicks
    if (envelope.classList.contains('opening') || envelope.classList.contains('opened')) {
        return;
    }

    // Add opening class to trigger animation
    envelope.classList.add('opening');

    if (typeof gsap !== 'undefined') {
        // Animate the envelope flap opening
        gsap.to(envelopeFlap, {
            duration: 0.8,
            rotationX: -180,
            ease: 'power2.inOut',
            onComplete: () => {
                // Mark as opened
                envelope.classList.remove('opening');
                envelope.classList.add('opened');

                // Reveal the letter as overlay on envelope section
                setTimeout(() => {
                    letterReveal.style.opacity = '1';
                    letterReveal.style.visibility = 'visible';

                    gsap.from(letterReveal, {
                        duration: 1,
                        scale: 0.8,
                        opacity: 0,
                        ease: 'back.out(1.7)'
                    });

                    // Animate letter paper entrance
                    gsap.from('.letter-paper', {
                        duration: 0.8,
                        y: 20,
                        rotationY: -15,
                        opacity: 0,
                        ease: 'power3.out',
                        delay: 0.3
                    });

                    // Animate letter content paragraphs
                    gsap.from('.letter-content p', {
                        duration: 0.6,
                        y: 20,
                        opacity: 0,
                        stagger: 0.2,
                        ease: 'power2.out',
                        delay: 0.8
                    });

                    // Animate signature
                    gsap.from('.letter-signature', {
                        duration: 0.6,
                        y: 20,
                        opacity: 0,
                        ease: 'power2.out',
                        delay: 1.5
                    });

                    // Create confetti effect for the envelope opening
                    createConfetti();
                }, 200);
            }
        });

        // Add a subtle shake effect to the envelope before opening
        gsap.to(envelope, {
            duration: 0.1,
            x: -2,
            repeat: 3,
            yoyo: true,
            ease: 'power2.inOut'
        });
    } else {
        // Fallback without animations
        envelope.classList.remove('opening');
        envelope.classList.add('opened');
        letterReveal.style.opacity = '1';
        letterReveal.style.visibility = 'visible';
    }
}

function showModal(title, message) {
    try {
        const modal = document.getElementById('birthday-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');

        if (!modal || !modalTitle || !modalMessage) {
            console.error('Modal elements not found');
            return;
        }

        // Set content
        modalTitle.textContent = title;
        modalMessage.textContent = message;

        // Show modal with proper styling
        modal.classList.add('show');
        modal.style.display = 'block';

        // Animate modal entrance only if GSAP is available
        if (typeof gsap !== 'undefined') {
            gsap.fromTo('.modal-content', {
                scale: 0.8,
                opacity: 0,
                y: 50
            }, {
                duration: 0.3,
                scale: 1,
                opacity: 1,
                y: 0,
                ease: 'back.out(1.7)'
            });
        }

        console.log('Modal shown successfully:', title);
    } catch (error) {
        console.error('Error showing modal:', error);
    }
}

function closeModal() {
    try {
        const modal = document.getElementById('birthday-modal');

        if (!modal) {
            console.error('Modal element not found');
            return;
        }

        if (typeof gsap !== 'undefined') {
            gsap.to('.modal-content', {
                duration: 0.3,
                scale: 0.8,
                opacity: 0,
                y: 50,
                ease: 'power3.in',
                onComplete: () => {
                    modal.classList.remove('show');
                    modal.style.display = 'none';
                    gsap.set('.modal-content', { scale: 1, opacity: 1, y: 0 });
                }
            });
        } else {
            modal.classList.remove('show');
            modal.style.display = 'none';
        }

        console.log('Modal closed successfully');
    } catch (error) {
        console.error('Error closing modal:', error);
        // Force close as fallback
        const modal = document.getElementById('birthday-modal');
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
        }
    }
}

function createConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    const colors = ['#e91e63', '#ff6b9d', '#ffd89b', '#19547b', '#a8edea', '#fed6e3'];

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confettiContainer.appendChild(confetti);

        // Remove confetti after animation
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 5000);
    }
}

function createFireworksAndFlowers() {
    // Start from top center of screen
    const startX = window.innerWidth / 2;
    const startY = 100; // 100px from top
    
    // Create fireworks
    const fireworks = ['🎆', '✨', '💥', '⭐', '🌟'];
    const flowers = ['🌹', '🌸', '🌺', '💐', '🌷', '🌻', '🌼'];
    
    // Firecracker bursts from top
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.textContent = fireworks[Math.floor(Math.random() * fireworks.length)];
            firework.style.position = 'fixed';
            firework.style.left = startX + 'px';
            firework.style.top = startY + 'px';
            firework.style.fontSize = (Math.random() * 30 + 25) + 'px';
            firework.style.zIndex = '10000';
            firework.style.pointerEvents = 'none';
            
            // Random angle for spreading effect
            const angle = Math.random() * Math.PI * 2;
            const distance = 150 + Math.random() * 200;
            
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(firework, {
                    x: 0,
                    y: 0,
                    opacity: 1,
                    scale: 0
                }, {
                    duration: 1.5,
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance + 100,
                    opacity: 0,
                    scale: 2,
                    ease: 'power2.out',
                    onComplete: () => firework.remove()
                });
            } else {
                // Fallback animation
                firework.style.animation = `fireworkAnimation 1s ease-out forwards`;
                setTimeout(() => firework.remove(), 1000);
            }
            
            document.body.appendChild(firework);
        }, i * 15);
    }
    
    // Flower petals flowing down from the top
    for (let i = 0; i < 80; i++) {
        setTimeout(() => {
            const flower = document.createElement('div');
            flower.className = 'falling-flower';
            flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
            flower.style.position = 'fixed';
            // Distribute flowers across the width of the screen
            flower.style.left = (Math.random() * window.innerWidth) + 'px';
            flower.style.top = '-50px'; // Start above the screen
            flower.style.fontSize = (Math.random() * 20 + 15) + 'px';
            flower.style.zIndex = '9999';
            flower.style.pointerEvents = 'none';
            
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(flower, {
                    y: 0,
                    rotation: 0,
                    opacity: 1,
                    scale: 1
                }, {
                    duration: 3 + Math.random() * 2,
                    y: window.innerHeight + 100,
                    rotation: Math.random() * 720, // 2 full rotations
                    opacity: 0,
                    scale: 0.3,
                    x: (Math.random() - 0.5) * 150, // Side drift while falling
                    ease: 'power1.in',
                    onComplete: () => flower.remove()
                });
            } else {
                // Fallback animation
                flower.style.animation = `fallingAnimation 3s ease-in forwards`;
                setTimeout(() => flower.remove(), 3000);
            }
            
            document.body.appendChild(flower);
        }, i * 30);
    }
}

// Add mouse movement effect for hearts
try {
    document.addEventListener('mousemove', function(e) {
        try {
            const hearts = document.querySelectorAll('.heart');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            hearts.forEach((heart, index) => {
                const speed = (index % 3 + 1) * 0.5;
                const x = (mouseX - 0.5) * speed;
                const y = (mouseY - 0.5) * speed;

                heart.style.transform = `translate(${x}px, ${y}px)`;
            });
        } catch (error) {
            console.error('Error in mousemove handler:', error);
        }
    });

    console.log('Mouse movement handler added successfully'); // Debug log
} catch (error) {
    console.error('Error adding mousemove handler:', error);
}

// Add click effect to buttons and interactive elements
try {
    document.querySelectorAll('button, .memory-item, .wish-item, .photo-placeholder').forEach(element => {
        element.addEventListener('click', function() {
            try {
                // Create ripple effect
                const ripple = document.createElement('div');
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.6)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s linear';
                ripple.style.left = '50%';
                ripple.style.top = '50%';
                ripple.style.width = '20px';
                ripple.style.height = '20px';
                ripple.style.marginLeft = '-10px';
                ripple.style.marginTop = '-10px';

                this.appendChild(ripple);

                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.remove();
                    }
                }, 600);
            } catch (error) {
                console.error('Error creating ripple effect:', error);
            }
        });
    });

    console.log('Click handlers added successfully'); // Debug log
} catch (error) {
    console.error('Error adding click handlers:', error);
}

// Add keyboard support for closing modals
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
        closeMusicInstructions();
    }
});

// Add modal backdrop click handlers for both modals
try {
    const birthdayModal = document.getElementById('birthday-modal');
    const musicModal = document.getElementById('music-instructions-modal');

    if (birthdayModal) {
        birthdayModal.addEventListener('click', function(e) {
            if (e.target === birthdayModal) {
                closeModal();
            }
        });
    }

    if (musicModal) {
        musicModal.addEventListener('click', function(e) {
            if (e.target === musicModal) {
                closeMusicInstructions();
            }
        });
    }

    console.log('Modal backdrop handlers added successfully');
} catch (error) {
    console.error('Error adding modal backdrop handlers:', error);
}

function createFloatingImages() {
    const floatingImagesContainer = document.querySelector('.floating-images');
    const imagePaths = [
        'image/IMG_20230413_214513_038.jpg',
        'image/IMG_20230619_194902_400.jpg',
        'image/IMG_20230807_163046_458.jpg',
        'image/IMG_20240216_224142_349.jpg',
        'image/IMG_20240218_184306_596.jpg',
        'image/IMG_20240403_191156_738.jpg',
        'image/IMG_20240525_190929_674.jpg',
        'image/IMG_20250602_213810_765.jpg',
        'image/IMG_20250622_190902_560.jpg',
        'image/IMG_20250711_160851_690.jpg',
        'image/IMG_20250817_173137_413.jpg',
        'image/IMG_20250926_232539_781.jpg',
        'image/Snapchat-16410901.jpg',
        'image/Snapchat-60330490.jpg',
        'image/Snapchat-93872247.jpg'
    ];

    // Create multiple images with staggered delays for continuous flow
    for (let i = 0; i < 10; i++) {
        const img = document.createElement('img');
        img.src = imagePaths[i % imagePaths.length];
        img.className = 'floating-image';
        img.alt = 'Beautiful memory';
        img.style.animationDelay = `${i * 2}s`;

        // Add error handling for missing images
        img.onerror = function() {
            // If image fails to load, use a placeholder with emoji
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'floating-image floating-placeholder';
            placeholder.style.background = 'linear-gradient(135deg, #e91e63, #ad1457)';
            placeholder.style.display = 'flex';
            placeholder.style.alignItems = 'center';
            placeholder.style.justifyContent = 'center';
            placeholder.style.fontSize = '2rem';
            placeholder.style.color = 'white';
            placeholder.textContent = '💕';
            placeholder.style.animationDelay = `${i * 2}s`;
            floatingImagesContainer.appendChild(placeholder);
        };

        floatingImagesContainer.appendChild(img);

        // Add subtle interaction on hover (pause animation)
        img.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
            this.style.transform = 'scale(1.3) rotate(15deg)';
            this.style.zIndex = '1002';
        });

        img.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
            this.style.zIndex = '1';
        });
    }

    console.log('✨ Floating images created successfully with snake-like path animation!');
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    try {
    // Initialize music player
    initializeMusicPlayer();

    // Create floating images
    createFloatingImages();

        // Initialize animations
        initializeAnimations();
        
        // Set up event listeners
        setupEventListeners();
        
        // Start with music paused
        if (audio) {
            audio.volume = 0.7; // Set default volume
        }
        
        // Show the cake immediately
        showCakeWithCandle();
        
        // Show welcome message after a short delay
        setTimeout(() => {
            showModal(
                '🎉 Welcome to Your Special Day!',
                'Here\'s a special cake for you! Click the candles to blow them out. 🎂✨'
            );
        }, 1000);
    } catch (error) {
        console.error('Error initializing page:', error);
    }
});

    console.log('✨ Page initialized successfully!');
