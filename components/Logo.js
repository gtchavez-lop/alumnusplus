import Image from 'next/image';

const Logo = ({ color }) => {
  color = color || '#101010';

  return (
    <>
      <div className="relative w-24 h-16">
        <Image
          style={{
            filter: 'invert(1)',
          }}
          priority
          src={'/alumnusplus.svg'}
          layout="fill"
          // width={120}
          // height={30}
          objectFit="contain"
        />
      </div>
    </>
  );
};

export default Logo;
