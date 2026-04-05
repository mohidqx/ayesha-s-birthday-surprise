import { useState, useEffect } from "react";
import { Heart, Camera, Upload, X, Loader2, GripVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface GalleryPhoto {
  id: string;
  file_path: string;
  caption: string | null;
  display_order: number;
  created_at: string;
}

interface SortablePhotoProps {
  photo: GalleryPhoto;
  getPhotoUrl: (path: string) => string;
  onDelete: (photo: GalleryPhoto) => void;
}

const SortablePhoto = ({ photo, getPhotoUrl, onDelete }: SortablePhotoProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`aspect-square rounded-2xl overflow-hidden shadow-romantic border border-rose-medium/20 group relative ${
        isDragging ? "ring-4 ring-primary/50 scale-105" : ""
      }`}
    >
      <img
        src={getPhotoUrl(photo.file_path)}
        alt={photo.caption || "Memory"}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 p-2 bg-black/50 rounded-lg text-white cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity touch-none"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Overlay with caption */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
        {photo.caption && (
          <p className="text-white font-body text-sm">{photo.caption}</p>
        )}
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(photo)}
        className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Heart overlay on hover */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Heart className="w-12 h-12 text-white opacity-0 group-hover:opacity-80 transition-opacity duration-300 fill-white/50 drop-shadow-lg" />
      </div>
    </div>
  );
};

const PhotoGallery = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching photos:", error);
      return;
    }

    setPhotos(data || []);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = photos.findIndex((p) => p.id === active.id);
      const newIndex = photos.findIndex((p) => p.id === over.id);

      const newPhotos = arrayMove(photos, oldIndex, newIndex);
      setPhotos(newPhotos);

      // Update display_order in database
      const updates = newPhotos.map((photo, index) => ({
        id: photo.id,
        file_path: photo.file_path,
        caption: photo.caption,
        display_order: index,
        created_at: photo.created_at,
      }));

      for (const update of updates) {
        await supabase
          .from("gallery_photos")
          .update({ display_order: update.display_order })
          .eq("id", update.id);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("gallery_photos").insert({
        file_path: filePath,
        caption: caption || null,
        display_order: photos.length,
      });

      if (dbError) throw dbError;

      toast({
        title: "Photo uploaded! 💕",
        description: "Your memory has been added to the gallery.",
      });

      setSelectedFile(null);
      setPreviewUrl(null);
      setCaption("");
      setShowUploadModal(false);
      fetchPhotos();
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getPhotoUrl = (filePath: string) => {
    const { data } = supabase.storage.from("gallery").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleDelete = async (photo: GalleryPhoto) => {
    try {
      await supabase.storage.from("gallery").remove([photo.file_path]);
      await supabase.from("gallery_photos").delete().eq("id", photo.id);

      toast({
        title: "Photo removed",
        description: "The photo has been deleted.",
      });

      fetchPhotos();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <section className="py-20 px-4 bg-background relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 blur-3xl rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <Camera className="w-8 h-8 mx-auto text-primary mb-4" />
          <h2 className="font-script text-4xl md:text-5xl text-primary mb-2">
            Our Memories
          </h2>
          <p className="font-body text-muted-foreground mt-4 max-w-md mx-auto">
            Every moment with you is a treasure I hold close to my heart
          </p>
          <p className="font-body text-muted-foreground/60 text-sm mt-2">
            ✨ Drag photos to rearrange them
          </p>
          <div className="w-24 h-0.5 bg-gold mx-auto mt-6" />
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={photos.map((p) => p.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
              {photos.map((photo) => (
                <SortablePhoto
                  key={photo.id}
                  photo={photo}
                  getPhotoUrl={getPhotoUrl}
                  onDelete={handleDelete}
                />
              ))}

              {/* Upload Button Card */}
              <button
                onClick={() => setShowUploadModal(true)}
                className="aspect-square rounded-2xl overflow-hidden shadow-romantic border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-rose-light to-secondary group cursor-pointer"
              >
                <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="font-body text-sm text-muted-foreground group-hover:text-primary transition-colors">
                  Add Photo
                </p>
              </button>
            </div>
          </SortableContext>
        </DndContext>

        {photos.length === 0 && (
          <p className="text-center text-muted-foreground font-body text-sm italic mb-8">
            💕 Upload your favorite memories together 💕
          </p>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="luxury-card p-6 md:p-8 max-w-md w-full animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-xl text-foreground">
                Add a Memory
              </h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setCaption("");
                }}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewUrl ? (
              <div className="relative mb-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full aspect-square object-cover rounded-xl"
                />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="block mb-4 cursor-pointer group/upload">
                <div
                  className="border-2 border-dashed border-primary/30 hover:border-primary/60 rounded-xl p-8 text-center transition-all duration-300 hover:bg-primary/5 hover:scale-[1.01]"
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-primary', 'bg-primary/10', 'scale-[1.02]'); }}
                  onDragLeave={(e) => { e.currentTarget.classList.remove('border-primary', 'bg-primary/10', 'scale-[1.02]'); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-primary', 'bg-primary/10', 'scale-[1.02]');
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type.startsWith('image/')) {
                      setSelectedFile(file);
                      setPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                >
                  <Upload className="w-12 h-12 mx-auto text-primary/50 mb-3 group-hover/upload:text-primary transition-colors" />
                  <p className="font-body text-sm text-muted-foreground font-medium">
                    Click or drag & drop a photo
                  </p>
                  <p className="font-body text-xs text-muted-foreground/60 mt-1">
                    JPG, PNG, WEBP supported
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            )}

            <input
              type="text"
              placeholder="Add a caption (optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-rose-medium/30 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 font-body text-sm mb-4"
            />

            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full py-3 rounded-xl font-body font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              style={{
                background:
                  "linear-gradient(135deg, hsl(340 82% 52%) 0%, hsl(340 85% 45%) 50%, hsl(15 45% 55%) 100%)",
              }}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  Add to Gallery
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PhotoGallery;
