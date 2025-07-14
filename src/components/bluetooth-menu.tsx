
'use client';

import { ArrowLeft, Battery, Headphones, Loader2, Monitor } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { cn } from '@/lib/utils';

interface BluetoothMenuProps {
  onConnect: () => void;
  onClose: () => void;
  connectedDeviceName: string | null;
  error: string | null;
  isLoading: boolean;
}

// Mock data to match the screenshot's appearance
const MOCK_DEVICES = [
  { name: 'OPPO Enco Buds', type: 'headset' },
  { name: 'ZEB-DUKE', type: 'headset' },
  { name: 'S684', type: 'headset' },
  { name: 'ZEB-DUKE', type: 'headset' }, // Duplicates are in the screenshot
  { name: 'My PC', type: 'computer' },
];

export default function BluetoothMenu({ 
    onConnect, 
    onClose, 
    connectedDeviceName,
    error,
    isLoading 
}: BluetoothMenuProps) {
  
  const getDeviceIcon = (type: string) => {
      switch(type) {
          case 'headset': return <Headphones size={24} className="text-zinc-400" />;
          case 'computer': return <Monitor size={24} className="text-zinc-400" />;
          default: return <Headphones size={24} className="text-zinc-400" />;
      }
  }
  
  // A device is connected if its name matches the `connectedDeviceName` prop.
  const isConnected = (name: string) => name === connectedDeviceName;

  return (
    <div className="w-80 bg-zinc-900 border border-zinc-700 text-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={onClose}>
                <ArrowLeft size={20} />
            </Button>
            <h2 className="font-semibold text-lg">Bluetooth</h2>
        </div>
        <Switch defaultChecked id="bluetooth-toggle" />
      </div>

      <Separator className="bg-zinc-800" />
      
      <div className="p-3">
        <h3 className="font-semibold text-zinc-300 mb-2 text-sm">Your devices</h3>
        <div className="space-y-1">
            {/* Display the currently connected device first if it's not in the mock list */}
            {connectedDeviceName && !MOCK_DEVICES.some(d => d.name === connectedDeviceName) && (
                <div className="flex items-center justify-between p-2 rounded-md bg-zinc-800">
                    <div className="flex items-center gap-3">
                        {getDeviceIcon('headset')}
                        <div>
                            <p className="font-medium text-primary">{connectedDeviceName}</p>
                            <p className="text-xs text-zinc-400">Connected mic, audio</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary">
                        <span>100%</span>
                        <Battery size={20} className="text-primary" />
                    </div>
                </div>
             )}

            {/* Display mock devices */}
            {MOCK_DEVICES.map((device, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-800 cursor-pointer">
                    <div className="flex items-center gap-3">
                       {getDeviceIcon(device.type)}
                        <div>
                            <p className={cn("font-medium", isConnected(device.name) && "text-primary")}>{device.name}</p>
                            <p className="text-xs text-zinc-400">
                                {isConnected(device.name) ? "Connected mic, audio" : "Not connected"}
                            </p>
                        </div>
                    </div>
                    {isConnected(device.name) && (
                        <div className="flex items-center gap-2 text-sm text-primary">
                            <span>100%</span>
                            <Battery size={20} className="text-primary"/>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>

      <Separator className="bg-zinc-800" />

      <div className='p-3'>
        <Button variant="ghost" className="w-full justify-center text-zinc-300 hover:text-white" onClick={onConnect} disabled={isLoading}>
          {isLoading ? (
              <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
              </>
          ) : (
              'Connect a new device'
          )}
        </Button>
        {error && <p className="text-sm text-destructive text-center mt-2">{error}</p>}
      </div>
    </div>
  );
}
