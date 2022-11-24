import { AnimatePresence, motion } from 'framer-motion';
import { icons } from 'react-icons';
import { FiBookmark, FiMoreHorizontal } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import __supabase from '../../lib/supabase';
import dayjs from 'dayjs';
import { useClient } from 'react-supabase';
import { useRouter } from 'next/router';
import uuidv4 from '../../lib/uuidv4';

const JobPreview = () => {
  const [bookMark, setBookMark] = useState(false);
  const [jobListing, setJobListing] = useState([]);
  const fetchdata = async () => {
    const { data, error } = await __supabase.from('job_postings').select('*');
    if (data && !error) {
      setJobListing(data);
    }
  };

  const handleClick = () => {
    setBookMark(!bookMark);
  };

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="overflow-x-auto w-full">
      {/* <table className="table w-full">
        <thead>
          <tr>
            <th colSpan={5}>
              <p className="text-center text-2xl">Recommended for you</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {jobListing &&
            jobListing.map((item) => (
              <tr>
                <th>
                  <button
                    className="flex justify-center items-center"
                    onClick={handleClick}
                  >
                    <FiBookmark className="text-lg stroke-primary fill-transparent hover:fill-primary ${(bookMark === true)}" />
                  </button>
                </th>
                <td>
                  <div className="flex items-center space-x-3">
                    <img
                      src={`https://avatars.dicebear.com/api/bottts/${item.uploader_legal_name}.svg`}
                      width={45}
                      height={45}
                      className="rounded-full"
                      alt="avatar"
                    />

                    <div>
                      <div className="font-bold">{item.job_title}</div>
                      <div className="text-sm opacity-50">
                        {item.uploader_legal_name}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  {item.job_location}
                  <br />
                  <span className="badge badge-ghost badge-sm">
                    {item.job_type}
                  </span>
                </td>
                <th>
                  <button className="btn btn-ghost btn-xs">details ⮞</button>
                </th>
              </tr>
            ))}
        </tbody>
      </table> */}

      {/* <div class="card card-compact  bg-base-100 shadow-xl">
        <div>
          <button
            className="flex justify-center items-center"
            onClick={handleClick}
          >
            <FiBookmark className="text-lg stroke-primary fill-transparent hover:fill-primary ${(bookMark === true)}" />
          </button>
        </div>

        <div class="card-body">
          <h2 class="card-title">Shoes!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div> */}
      <div className="flex flex-col gap-5">
        {jobListing &&
          jobListing.map((item) => (
            <div className="flex py-2 lg:items-center gap-5 flex-col lg:flex-row bg-base-200 rounded-btn p-5">
              <div className="hidden lg:flex items-center ">
                <button className="btn btn-ghost btn-square">
                  <FiBookmark />
                </button>
              </div>

              <div className="flex items-center gap-2 w-full">
                <img
                  src={`https://avatars.dicebear.com/api/bottts/${item.uploader_legal_name}.svg`}
                  width={45}
                  height={45}
                  className="rounded-full"
                  alt="avatar"
                />
                <div>
                  <p className="leading-none text-lg">{item.job_title}</p>
                  <p className="leading-none opacity-75">
                    {item.uploader_legal_name}
                  </p>
                </div>
              </div>

              <div className="w-[200px]">
                <p>{item.job_location}</p>
              </div>
              <div className="w-[200px]">
                <p className="badge badge-primary">{item.job_type}</p>
              </div>
              <div className="flex justify-end gap-3">
                <button className="lg:hidden btn btn-ghost btn-square">
                  <FiBookmark />
                </button>
                <button className="btn btn-ghost btn-square">
                  <FiMoreHorizontal />
                </button>
              </div>
            </div>
          ))}

        <p>mewenjajd</p>
      </div>
    </div>
  );
};

export default JobPreview;
