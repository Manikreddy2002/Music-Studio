
import ArtistCard from './artist-card';

const featuredArtists = [
    { id: 'shreya-ghoshal', name: 'Shreya Ghoshal', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Shreya_Ghoshal_at_the_launch_of_her_new_album_Humnasheen_1.jpg', hint: 'Shreya Ghoshal' },
    { id: 'arijit-singh', name: 'Arijit Singh', image: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Arijit_Singh_at_Mirchi_Music_Awards_2023.jpg', hint: 'Arijit Singh' },
    { id: 'ar-rahman', name: 'A. R. Rahman', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/A._R._Rahman_in_2023.jpg', hint: 'AR Rahman' },
    { id: 'lata-mangeshkar', name: 'Lata Mangeshkar', image: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Lata_Mangeshkar_at_Sansui_Colors_Stardust_Awards%2C_2016.jpg', hint: 'Lata Mangeshkar' },
    { id: 'sonu-nigam', name: 'Sonu Nigam', image: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Sonu_Nigam_at_the_red_carpet_of_BIG_Star_Entertainment_Awards_2012.jpg', hint: 'Sonu Nigam' },
    { id: 'anirudh-ravichander', name: 'Anirudh Ravichander', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Anirudh_Ravichander_at_the_Jailer_Audio_Launch.jpg', hint: 'Anirudh Ravichander' },
    { id: 'devi-sri-prasad', name: 'Devi Sri Prasad', image: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Devi_Sri_Prasad_at_the_audio_launch_of_Sardaar_Gabbar_Singh.jpg', hint: 'Devi Prasad' },
    { id: 'pritam', name: 'Pritam', image: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Pritam_at_the_screening_of_Love_Aaj_Kal_2.jpg', hint: 'Pritam' },
    { id: 'badshah', name: 'Badshah', image: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Badshah_at_the_screening_of_Movie_Street_Dancer_3D.jpg', hint: 'Badshah' },
    { id: 'neha-kakkar', name: 'Neha Kakkar', image: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Neha_Kakkar_at_the_Launch_of_Her_Own_App_2.0.jpg', hint: 'Neha Kakkar' },
    { id: 'thaman-s', name: 'Thaman S', image: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Thaman_S_at_an_event_for_the_film_Thoofan.jpg', hint: 'Thaman S' },
    { id: 'sid-sriram', name: 'Sid Sriram', image: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Sid_Sriram_at_an_event.jpg', hint: 'Sid Sriram' },
];

export default function ArtistSection() {
    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Featured Artists</h2>
                <a href="#" className="text-sm font-semibold text-zinc-400 hover:underline">Show all</a>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
                {featuredArtists.map((artist) => (
                    <ArtistCard key={artist.name} artist={artist} />
                ))}
            </div>
        </div>
    );
}
