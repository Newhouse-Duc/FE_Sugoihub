import React, { useEffect, useState } from 'react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';
import { Button } from 'antd';

const gf = new GiphyFetch('UYTU8tqOjlcaAaw1AoGp4sJFnGr2Rwsv');

const Giphy = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [gifs, setGifs] = useState([]);
    const [selectedGif, setSelectedGif] = useState(null); // State để lưu GIF được chọn

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
    }

    const handleGifClick = (gif, event) => {
        event.preventDefault();
        setSelectedGif({ id: gif.id, url: gif.images.original.url, title: gif.title });
        console.log("GIF được chọn:", gif);
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
                        <p>Tiêu đề: {selectedGif.title}</p>

                    </div>
                )}
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm GIF..."
                        className='bg-slate-300'
                    />
                    <button type="submit" className='bg-white border border-spacing-1 border-x-8'>Tìm kiếm</button>
                </form>
            </div>
        </>
    );
}

export default Giphy;