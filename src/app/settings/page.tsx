
import HomeHeader from "@/components/home-header";
import { Settings as SettingsIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import EqualizerChart from "@/components/equalizer-chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-6 h-full text-white overflow-y-auto no-scrollbar">
        <HomeHeader />
        <div className="flex items-center gap-4 mb-8">
            <div className="bg-zinc-800 p-4 rounded-full">
                <SettingsIcon size={32} />
            </div>
            <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="space-y-12">
            <section>
                <h2 className="text-2xl font-bold mb-4">Display</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                         <div>
                            <p>Show the now-playing panel on click of play</p>
                            <p className="text-zinc-400 text-sm">Opens the Now Playing view when you start playback.</p>
                        </div>
                        <Switch id="now-playing-panel" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                         <div>
                            <p>Display short, looping visuals on tracks (Canvas)</p>
                            <p className="text-zinc-400 text-sm">Show short, looping visuals on the Now Playing screen.</p>
                        </div>
                        <Switch id="canvas-visuals" defaultChecked />
                    </div>
                </div>
            </section>
            
            <Separator className="bg-zinc-800" />

            <section>
                <h2 className="text-2xl font-bold mb-2">Playback</h2>
                <p className="text-zinc-400 text-sm mb-6">
                    Improve streaming quality, adjust the equaliser to best fit your speakers and enjoy consistent volume across all your tracks.
                </p>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="normalize-volume" className="text-base">Normalize volume</Label>
                        <Switch id="normalize-volume" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="streaming-quality" className="text-base">Streaming quality</Label>
                        <Select defaultValue="normal">
                            <SelectTrigger id="streaming-quality" className="w-[180px] bg-zinc-800 border-zinc-700">
                                <SelectValue placeholder="Select quality" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectItem value="auto">Automatic</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="very-high">Very High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Equaliser</h3>
                        <div className="p-4 bg-zinc-800/90 rounded-xl">
                            <EqualizerChart />
                            <p className="text-zinc-500 text-sm mt-2">
                                Note: Equalizer and audio settings are for demonstration purposes only.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
  );
}
