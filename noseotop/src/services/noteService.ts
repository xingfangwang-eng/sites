import { Note } from '../types/note';

const NOTES_KEY = 'notes';

// 获取所有笔记
export const getAllNotes = (): Note[] => {
  try {
    const notesJson = localStorage.getItem(NOTES_KEY);
    if (!notesJson) return [];
    const notes = JSON.parse(notesJson);
    // 将字符串日期转换为 Date 对象
    return notes.map((note: any) => ({
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
    }));
  } catch (error) {
    console.error('Error getting notes:', error);
    return [];
  }
};

// 保存笔记
export const saveNote = (note: Note): Note => {
  try {
    const notes = getAllNotes();
    const existingIndex = notes.findIndex(n => n.id === note.id);
    
    if (existingIndex >= 0) {
      // 更新现有笔记
      notes[existingIndex] = {
        ...note,
        updatedAt: new Date(),
      };
    } else {
      // 添加新笔记
      notes.push({
        ...note,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    return notes[existingIndex >= 0 ? existingIndex : notes.length - 1];
  } catch (error) {
    console.error('Error saving note:', error);
    return note;
  }
};

// 删除笔记
export const deleteNote = (id: string): boolean => {
  try {
    const notes = getAllNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    localStorage.setItem(NOTES_KEY, JSON.stringify(filteredNotes));
    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    return false;
  }
};

// 获取单个笔记
export const getNoteById = (id: string): Note | null => {
  try {
    const notes = getAllNotes();
    return notes.find(note => note.id === id) || null;
  } catch (error) {
    console.error('Error getting note:', error);
    return null;
  }
};

// 切换笔记收藏状态
export const toggleFavorite = (id: string): Note | null => {
  try {
    const notes = getAllNotes();
    const noteIndex = notes.findIndex(note => note.id === id);
    
    if (noteIndex >= 0) {
      notes[noteIndex] = {
        ...notes[noteIndex],
        isFavorite: !notes[noteIndex].isFavorite,
        updatedAt: new Date(),
      };
      
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
      return notes[noteIndex];
    }
    
    return null;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return null;
  }
};
