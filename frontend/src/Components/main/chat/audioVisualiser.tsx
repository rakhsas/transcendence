import React, { useRef, useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
const AudioPlayerWithWaveform = ({ audioSrc }: any) => {
    const waveFormRef = useRef(null);
    const waveSurfer = useRef<WaveSurfer>();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState('');

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
        if (waveSurfer.current) {
            if (waveSurfer.current.isPlaying()) {
                waveSurfer.current.pause();
            } else {
                waveSurfer.current.play();
            }
        }
    };
    const waveSurferOptions = (ref: any) => ({
        container: ref,
        waveColor: '#6B7280',
        progressColor: '#40c057',
        cursorColor: 'transparent',
        barWidth: 3,
        barRadius: 10,
        responsive: true,
        height: 25,
        normalize: true,
        barGap: 3,
    })
    
    useEffect(() => {
        if (!waveFormRef.current) return; // Ensure waveFormRef is available
    
        const options = waveSurferOptions(waveFormRef.current);
        waveSurfer.current = WaveSurfer.create(options);
    
        waveSurfer.current.load(audioSrc);
        waveSurfer.current.on('ready', () => {
            setCurrentTime(convertSecToMin(waveSurfer.current!.getDuration()));
        });
        waveSurfer.current.on('finish', () => {
            setIsPlaying(false);
            waveSurfer.current!.stop();
        });
    
        return () => {
            if (waveSurfer.current) {
                waveSurfer.current.destroy();
            }
        };
    }, [audioSrc]);
    
    const convertSecToMin = (duration: number) => {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return (
        <div className="flex flex-row justify-between gap-1 items-center">
            <div onClick={togglePlay}
                className="inline-flex self-center rounded-full items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                {isPlaying ? (
                    <svg
                        className="w-4 h-4 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 14 16"
                    >
                        <path d="M3 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm7 0H9a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Z" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 18V6l8 6-8 6Z" />
                    </svg>

                )}
            </div>
            <div className='w-3/4' id="waveform" ref={waveFormRef}></div>
            <div className="duration">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                {currentTime}
                </span>
            </div>
        </div>
    );
};

export default AudioPlayerWithWaveform;
