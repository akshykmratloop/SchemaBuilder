import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Save } from 'lucide-react';

interface Schema {
  id: number;
  name: string;
  structure: {
    sections: {
      id: string;
      name: string;
      elements: {
        id: string;
        type: string;
        label: string;
      }[];
    }[];
  };
}

const ContentEditor = () => {
  const { schemaId } = useParams();
  const { token } = useAuth();
  const [schema, setSchema] = useState<Schema | null>(null);
  const [content, setContent] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/schemas/${schemaId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch schema');
        const data = await response.json();
        setSchema(data);
      } catch (error) {
        console.error('Error fetching schema:', error);
      }
    };

    fetchSchema();
  }, [schemaId, token]);

  const handleContentChange = (elementId: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [elementId]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          schema_id: schemaId,
          data: content,
        }),
      });

      if (!response.ok) throw new Error('Failed to save content');
      alert('Content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save content');
    }
  };

  if (!schema) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{schema.name} - Content Editor</h1>

        {schema.structure.sections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">{section.name}</h2>

            <div className="space-y-4">
              {section.elements.map((element) => (
                <div key={element.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {element.label}
                  </label>
                  {element.type === 'image' ? (
                    <input
                      type="url"
                      value={content[element.id] || ''}
                      onChange={(e) => handleContentChange(element.id, e.target.value)}
                      placeholder="Enter image URL"
                      className="w-full p-2 border rounded"
                    />
                  ) : element.type === 'paragraph' ? (
                    <textarea
                      value={content[element.id] || ''}
                      onChange={(e) => handleContentChange(element.id, e.target.value)}
                      className="w-full p-2 border rounded h-32"
                    />
                  ) : (
                    <input
                      type="text"
                      value={content[element.id] || ''}
                      onChange={(e) => handleContentChange(element.id, e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleSave}
          className="fixed bottom-8 right-8 flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600"
        >
          <Save size={20} />
          Save Content
        </button>
      </div>
    </div>
  );
};

export default ContentEditor;