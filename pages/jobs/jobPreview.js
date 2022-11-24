import { AnimatePresence, motion } from 'framer-motion';
import { icons } from 'react-icons';
import { FiBookmark } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import __supabase from '../../lib/supabase';
import dayjs from 'dayjs';
import { useClient } from 'react-supabase';
import { useRouter } from 'next/router';
import uuidv4 from '../../lib/uuidv4';

const JobPreview = () => {
  const [jobListing, setJobListing] = useState([]);
  const fetchdata = async () => {
    const { data, error } = await __supabase.from('job_postings').select('*');
    if (data && !error) {
      setJobListing(data);
    }
  };
  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="overflow-x-auto w-full">
      <table className="table w-full">
        <thead>
          <tr>
            <th colSpan={5}>
              <p className="text-center text-2xl">Job Listings</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {jobListing &&
            jobListing.map((item) => (
              <tr>
                <th>
                  <label>
                    <FiBookmark className="w-8 h-8 stroke-primary fill-primary" />
                  </label>
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
      </table>
    </div>
  );
};

export default JobPreview;
