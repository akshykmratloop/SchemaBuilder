import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Save } from 'lucide-react';

interface Section {
  id: string;
  name: string;
  elements: {
    id: string;
    type: 'text' | 'heading' | 'image' | 'button' | 'paragraph';
    label: string;
  }[];
}

const SchemaBuilder = () => {
  const [schemaName, setSchemaName] = useState('');
  const [sections, setSections] = useState<Section[]>([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now().toString(),
        name: `Section ${sections.length + 1}`,
        elements: [],
      },
    ]);
  };

  const addElement = (sectionId: string, type: Section['elements'][0]['type']) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              elements: [
                ...section.elements,
                {
                  id: Date.now().toString(),
                  type,
                  label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${
                    section.elements.length + 1
                  }`,
                },
              ],
            }
          : section
      )
    );
  };

  const removeSection = (sectionId: string) => {
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  const removeElement = (sectionId: string, elementId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              elements: section.elements.filter((element) => element.id !== elementId),
            }
          : section
      )
    );
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/schemas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: schemaName,
          structure: { sections },
        }),
      });

      if (!response.ok) throw new Error('Failed to save schema');

      const data = await response.json();
      navigate(`/content/${data.id}`);
    } catch (error) {
      console.error('Error saving schema:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Schema Builder</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <input
            type="text"
            value={schemaName}
            onChange={(e) => setSchemaName(e.target.value)}
            placeholder="Enter schema name"
            className="w-full p-2 border rounded mb-4"
          />
          
          <button
            onClick={addSection}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <Plus size={20} />
            Add Section
          </button>
        </div>

        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                value={section.name}
                onChange={(e) =>
                  setSections(
                    sections.map((s) =>
                      s.id === section.id ? { ...s, name: e.target.value } : s
                    )
                  )
                }
                className="text-xl font-semibold p-2 border rounded"
              />
              <button
                onClick={() => removeSection(section.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => addElement(section.id, 'heading')}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              >
                Add Heading
              </button>
              <button
                onClick={() => addElement(section.id, 'text')}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              >
                Add Text
              </button>
              <button
                onClick={() => addElement(section.id, 'image')}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              >
                Add Image
              </button>
              <button
                onClick={() => addElement(section.id, 'button')}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              >
                Add Button
              </button>
              <button
                onClick={() => addElement(section.id, 'paragraph')}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              >
                Add Paragraph
              </button>
            </div>

            <div className="space-y-2">
              {section.elements.map((element) => (
                <div
                  key={element.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span>
                    {element.type.charAt(0).toUpperCase() + element.type.slice(1)}:{' '}
                    {element.label}
                  </span>
                  <button
                    onClick={() => removeElement(section.id, element.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {sections.length > 0 && (
          <button
            onClick={handleSave}
            className="fixed bottom-8 right-8 flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600"
          >
            <Save size={20} />
            Save Schema
          </button>
        )}
      </div>
    </div>
  );
};

export default SchemaBuilder;