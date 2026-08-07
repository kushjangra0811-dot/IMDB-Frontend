import { Instagram, Twitter } from "lucide-react";
import { getActorDetails } from "../../../../src/lib/api/mockActorApi";

export default async function SocialPanel({ params }: { params: { id: string } }) {
  const actor = await getActorDetails(params.id);
  
  return (
    <section className="bg-gray-800 p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Social Media</h2>
      <div className="flex gap-4">
        <a href={actor.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
          <Instagram className="w-8 h-8" />
        </a>
        <a href={actor.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
          <Twitter className="w-8 h-8" />
        </a>
      </div>
    </section>
  );
}
