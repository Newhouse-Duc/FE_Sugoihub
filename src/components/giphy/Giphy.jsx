import React, { useEffect, useState } from 'react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';
import { Button } from 'antd';
import { motion } from 'framer-motion';
const gf = new GiphyFetch('UYTU8tqOjlcaAaw1AoGp4sJFnGr2Rwsv');

const Giphy = ({ onGifSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [gifs, setGifs] = useState([]);
    const [selectedGif, setSelectedGif] = useState(null);

    const fetchGifs = async (offset) => {
        return gf.search(searchTerm, { offset, limit: 10 });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchGifs(0).then(({ data }) => {
            setGifs(data);
        });
    };
    const handleClear = () => {
        setSelectedGif(null)
        onGifSelect(null);

    }

    const handleGifClick = (gif, event) => {
        event.preventDefault();
        const selected = { id: gif.id, url: gif.images.original.url };
        setSelectedGif(selected);
        onGifSelect(selected);
    };
    useEffect(() => {
        if (searchTerm) {
            fetchGifs(0).then(({ data }) => {
                setGifs(data);
            });
        }
        console.log("GIF được chọn:", selectedGif);
    }, [searchTerm, selectedGif])

    return (
        <>
            <div className='relative bg-white '>
                {searchTerm && !selectedGif && (<div className='border overflow-y-auto h-52 z-auto'>


                    {gifs.length > 0 && (
                        <Grid
                            width={800}
                            columns={3}
                            gutter={6}
                            fetchGifs={fetchGifs}
                            key={searchTerm}
                            onGifClick={handleGifClick}
                        />
                    )}



                </div>)}


                {selectedGif && (
                    <div className="mt-4 ">
                        <h2>GIF đã chọn:</h2>

                        <div className='flex '>
                            <img
                                key={selectedGif.id}
                                src={selectedGif.url}
                                alt={selectedGif.title}
                                className="max-w-full  h-28 "
                            />
                            <Button type="dashed" shape="circle" icon={<i class="bi bi-x-circle"></i>} onClick={handleClear} />


                        </div>


                    </div>
                )}
                <form onSubmit={handleSearch} className="flex items-center gap-2">

                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm GIF..."
                            className="w-full px-4 py-2 pr-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />

                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <i className="bi bi-search text-gray-400"></i>
                        </div>
                    </div>


                    <button
                        type="submit"
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-800 focus:ring-offset-2 transition-all"
                    >
                        Tìm kiếm
                    </button>

                </form>
            </div>
        </>
    );
}

export default Giphy;