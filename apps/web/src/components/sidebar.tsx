'use client';
import { MdTipsAndUpdates, MdHomeFilled } from 'react-icons/md';
import { Button } from './material-tailwind';
import SidebarContainer from './sidebar-container';
import { useState } from 'react';
import {
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarLeftCollapse,
} from 'react-icons/tb';
import { useRouter } from 'next/navigation';
import { FaMap } from 'react-icons/fa';

function Sidebar() {
  const [display, setDisplay] = useState<'static' | 'float'>('static');
  const router = useRouter();
  return (
    <>
      {display === 'float' && (
        <div className=" fixed left-2 top-10 z-50">
          <Button
            variant="text"
            className="flex h-12 w-12 justify-start"
            size="sm"
            onClick={() => setDisplay('static')}
          >
            <span className="text-white">
              <TbLayoutSidebarLeftExpand />
            </span>
          </Button>
        </div>
      )}

      <SidebarContainer display={display}>
        <div className="flex justify-between">
          <Button
            variant="text"
            className="flex flex-1 justify-start"
            size="sm"
          >
            <h1 className="text-md font-bold text-gray-400">
              <span className="mr-2  text-lg text-white">
                <MdTipsAndUpdates className="inline-block" />
              </span>
              Ziphus
            </h1>
          </Button>
          <Button
            variant="text"
            className="flex h-12 w-12 items-center justify-center"
            size="sm"
            onClick={() =>
              setDisplay(display === 'static' ? 'float' : 'static')
            }
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
        <Button
          variant="text"
          className="flex w-full justify-start"
          size="sm"
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
        <Button
          variant="text"
          className="flex w-full justify-start"
          size="sm"
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
      </SidebarContainer>
    </>
  );
}

export default Sidebar;
