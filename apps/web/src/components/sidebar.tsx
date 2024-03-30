'use client';
import { MdTipsAndUpdates, MdHomeFilled } from 'react-icons/md';
import { Button } from './material-tailwind';
import SidebarContainer from './sidebar-container';
import { useState } from 'react';
import { TbLayoutSidebarLeftExpand, TbLayoutSidebarLeftCollapse } from 'react-icons/tb';
import { useRouter } from 'next/navigation';
import { FaMap } from 'react-icons/fa';
import { PiCardsBold } from 'react-icons/pi';

function Sidebar() {
  const [display, setDisplay] = useState<'static' | 'float'>('static');
  const router = useRouter();
  return (
    <>
      {
        display === 'float' && (
          <div className=' fixed top-10 left-2 z-50'>
            <Button variant="text" className="flex w-12 h-12 justify-start" size="sm" onClick={() => setDisplay('static')}>
              <span className="text-white">
                <TbLayoutSidebarLeftExpand />
              </span>
            </Button>
          </div>
        )
      }

      <SidebarContainer display={display}>
        <div className="flex justify-between">
          <Button variant="text" className="flex flex-1 justify-start" size="sm">
            <h1 className="text-md font-bold text-gray-400">
              <span className="mr-2  text-lg text-white">
                <MdTipsAndUpdates className="inline-block" />
              </span>
              Ziphus
            </h1>
          </Button>
          <Button
            variant="text"
            className="flex justify-center items-center w-12 h-12"
            size="sm"
            onClick={() => setDisplay(display === 'static' ? 'float' : 'static')}
          >
            {display === 'static' ? (
              <span className="text-white">
                <TbLayoutSidebarLeftCollapse />
              </span>
            ) : (
              <span className="text-white">
                <TbLayoutSidebarLeftExpand />
              </span>
            )}
          </Button>
        </div>
        <Button variant="text" className="flex flex-1 justify-start" size="sm"
          onClick={() => {
            router.push('/');
          }}
        >
          <h1 className="text-md font-bold text-gray-400">
            <span className="mr-2  text-lg text-white">
              <MdHomeFilled className="inline-block" />
            </span>
            Home
          </h1>
        </Button>
        <Button variant="text" className="flex flex-1 justify-start" size="sm"
          onAbort={() => {
            router.push('/spaces');
          }}
        >
          <h1 className="text-md font-bold text-gray-400">
            <span className="mr-2  text-lg text-white">
              <FaMap className="inline-block" />
            </span>
            Spaces
          </h1>
        </Button>
        <Button variant="text" className="flex flex-1 justify-start" size="sm"
          onAbort={() => {
            router.push('/cards');
          }}
        >
          <h1 className="text-md font-bold text-gray-400">
            <span className="mr-2  text-lg text-white">
              <PiCardsBold className="inline-block" />
            </span>
            Cards
          </h1>
        </Button>


      </SidebarContainer>
    </>
  );
}

export default Sidebar;
