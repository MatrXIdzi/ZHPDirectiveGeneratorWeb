import React, { useEffect, useState } from "react";
import { 
  Directive, 
  UserData, 
  LastDirectiveData, 
  templates, 
  ChapterKey, 
  SubChapterKey,
  availableChaptersData
} from "./DirectiveTypes.ts";
import "./NewDirective.css";

import TemplateForm from "../components/TemplateForm.tsx";
const NewDirective: React.FC = () => {

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getTodayYear = () => {
    const today = new Date();
    return today.getFullYear().toString();
  }

  const [directive, setDirective] = useState<Directive>({ date: getTodayDate(), city: "", serialNumber: "", chapters: {} });
  const [selectedChapter, setSelectedChapter] = useState<ChapterKey | "">("");
  const [selectedSubChapters, setSelectedSubChapters] = useState<Partial<Record<ChapterKey, SubChapterKey | "">>>({});

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [currentChapterKey, setCurrentChapterKey] = useState<ChapterKey | null>(null);
  const [currentSubChapterKey, setCurrentSubChapterKey] = useState<SubChapterKey | null>(null);

  const [signatureFirst, setSignatureFirst] = useState("");
  const [signatureSecond, setSignatureSecond] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);

  const [editingParagraph, setEditingParagraph] = useState<{
    chapterKey: ChapterKey;
    subChapterKey: SubChapterKey;
    index: number;
    value: string;
  } | null>(null);

  const token = localStorage.getItem('token');
  if (!token) return null;
  const decoded: any = JSON.parse(atob(token.split('.')[1]));
  const username = decoded.sub;

  const startEditingParagraph = (chapterKey: ChapterKey, subChapterKey: SubChapterKey, index: number, value: string) => {
    setEditingParagraph({ chapterKey, subChapterKey, index, value });
  };

  const saveEditedParagraph = () => {
    if (!editingParagraph) return;
  
    const { chapterKey, subChapterKey, index, value } = editingParagraph;
  
    setDirective(prev => {
      const updatedParagraphs = [...(prev.chapters[chapterKey]?.content[subChapterKey] || [])];
      updatedParagraphs[index] = value;
      return {
        ...prev,
        chapters: {
          ...prev.chapters,
          [chapterKey]: {
            ...prev.chapters[chapterKey]!,
            content: {
              ...prev.chapters[chapterKey]?.content,
              [subChapterKey]: updatedParagraphs,
            },
          },
        },
      };
    });
  
    setEditingParagraph(null);
  };

  const handleRemoveParagraph = (chapterKey: ChapterKey, subChapterKey: SubChapterKey, paraIndex: number) => {
    setDirective(prev => {
      const updatedParagraphs = (prev.chapters[chapterKey]?.content[subChapterKey] || []).filter((_, idx) => idx !== paraIndex);
      return {
        ...prev,
        chapters: {
          ...prev.chapters,
          [chapterKey]: {
            ...prev.chapters[chapterKey]!,
            content: {
              ...prev.chapters[chapterKey]?.content,
              [subChapterKey]: updatedParagraphs,
            },
          },
        },
      };
    });
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, lastDirectiveRes] = await Promise.all([
          fetch(`http://localhost:8080/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`http://localhost:8080/api/user/${username}/last-directive-data`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const userData: UserData = await userRes.json();
        const lastDirectiveData: LastDirectiveData = await lastDirectiveRes.json();

        setUserData(userData);
        setSignatureFirst(lastDirectiveData.signatureFirst);
        setSignatureSecond(lastDirectiveData.signatureSecond);

        setDirective(prev => ({
          ...prev,
          city: lastDirectiveData.city,
          serialNumber: (parseInt(lastDirectiveData.serialNumber) + 1).toString()
        }));
      } catch (error) {
        console.error("Błąd ładowania danych:", error);
      }
    };

    fetchData();
  }, [token, username]);

  const handleAddChapter = (chapterKey: ChapterKey) => {
    if (!directive.chapters[chapterKey]) {
      setDirective(prev => ({
        ...prev,
        chapters: {
          ...prev.chapters,
          [chapterKey]: {
            title: availableChaptersData[chapterKey].title,
            content: {},
          },
        },
      }));
    }
    setSelectedChapter("");
  };

  const handleRemoveChapter = (chapterKey: ChapterKey) => {
    const updatedChapters = { ...directive.chapters };
    delete updatedChapters[chapterKey];
    setDirective(prev => ({
      ...prev,
      chapters: updatedChapters,
    }));
  };

  const handleAddSubChapter = (chapterKey: ChapterKey, subChapterKey: SubChapterKey) => {
    setDirective(prev => ({
      ...prev,
      chapters: {
        ...prev.chapters,
        [chapterKey]: {
          ...prev.chapters[chapterKey]!,
          content: {
            ...prev.chapters[chapterKey]?.content,
            [subChapterKey]: [],
          },
        },
      },
    }));
    setSelectedSubChapters(prev => ({ ...prev, [chapterKey]: "" }));
  };

  const handleRemoveSubChapter = (chapterKey: ChapterKey, subChapterKey: SubChapterKey) => {
    const updatedContent = { ...directive.chapters[chapterKey]?.content };
    delete updatedContent[subChapterKey];
    setDirective(prev => ({
      ...prev,
      chapters: {
        ...prev.chapters,
        [chapterKey]: {
          ...prev.chapters[chapterKey]!,
          content: updatedContent,
        },
      },
    }));
  };

  const handleAddParagraph = (chapterKey: ChapterKey, subChapterKey: SubChapterKey, text: string) => {
    setDirective(prev => {
      const currentParagraphs = prev.chapters[chapterKey]?.content[subChapterKey] || [];
      return {
        ...prev,
        chapters: {
          ...prev.chapters,
          [chapterKey]: {
            ...prev.chapters[chapterKey]!,
            content: {
              ...prev.chapters[chapterKey]?.content,
              [subChapterKey]: [...currentParagraphs, text],
            },
          },
        },
      };
    });
    setSelectedTemplate("");
    setCurrentChapterKey(null);
    setCurrentSubChapterKey(null);
  };

  const handleSubmit = async () => {
    const fullDirective = {
      ...directive,
      authorUsername: username,
      chapters: Object.fromEntries(
        Object.entries(directive.chapters)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([chapterKey, chapter]) => [
            chapterKey,
            {
              ...chapter,
              content: Object.fromEntries(
                Object.entries(chapter.content || {})
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([subChapterKey, paragraphs]) => [
                    subChapterKey,
                    (paragraphs || []).join('\n'),
                  ])
              ),
            },
          ])
      ),
    };

    const signaturePayload = {
      city: directive.city,
      serialNumber: directive.serialNumber,
      signatureFirst,
      signatureSecond,
    };

    try {
      const response = await fetch(`http://localhost:8080/api/directive/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fullDirective),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert("Błąd: " + errorText);
        return;
      }

      const response2 = await fetch(`http://localhost:8080/api/user/${username}/last-directive-data`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signaturePayload),
      });

      if (!response2.ok) {
        const errorText = await response2.text();
        console.error(errorText);
        return;
      }

      alert("Rozkaz utworzony i dane podpisu zapisane!");
      setDirective({ date: "", city: "", serialNumber: "", chapters: {} });
      setSignatureFirst("");
      setSignatureSecond("");

    } catch (error: any) {
      console.error(error);
      alert("Błąd wysyłania: " + error.message);
    }
  };
  const chapterEntries = Object.entries(directive.chapters).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="directive-container">
      <div className="directive-form">
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1>Tworzenie nowego Rozkazu</h1>
          </div>
          <hr style={{
            border: 'none',
            height: '1px',
            backgroundColor: 'white',
            margin: 0
          }}/>
          <div style={{ margin: "40px 0" }}/>

          {/* Główne dane */}
          <div className="directive-header">
            <div className="directive-title-left">
              <div>Związek Harcerstwa Polskiego</div>
              <div>{userData?.unit?.region}</div>
              <div>{userData?.unit?.district}</div>
              <div>{userData?.unit?.group}</div>
              <div>{userData?.unit?.troop}</div>
            </div>
            <div className="directive-city-date">
              <input
                type="text"
                placeholder="Miasto"
                value={directive.city}
                onChange={(e) => setDirective(prev => ({ ...prev, city: e.target.value }))}
              />
              <input
                type="date"
                value={directive.date}
                onChange={(e) => setDirective(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div/>
            <div style = {{display: "flex", alignItems: "center", marginBottom: "20px", gap: "10px"}}>
              <div>Rozkaz L.</div>
                <input
                  type="text"
                  className="directive-serial-number"
                  placeholder="Numer seryjny"
                  value={directive.serialNumber}
                  onChange={(e) => setDirective(prev => ({ ...prev, serialNumber: e.target.value }))}
                />
              <div>/ {getTodayYear()}</div>
            </div>
            <div/>
          </div>
          

          {/* Dodawanie rozdziałów */}
          <div style={{ marginBottom: "20px" }}>
            <select
              value={selectedChapter}
              onChange={(e) => {
                const chapterKey = e.target.value as ChapterKey;
                if (chapterKey) handleAddChapter(chapterKey);
              }}
              style={{ width: "100%" }}
            >
              <option value="">Wybierz rozdział do dodania</option>
              {Object.keys(availableChaptersData)
                .filter(chapterKey => !(chapterKey in directive.chapters))
                .sort()
                .map(chapterKey => (
                  <option key={chapterKey} value={chapterKey}>
                    {availableChaptersData[chapterKey as ChapterKey].title}
                  </option>
                ))}
            </select>
          </div>

          {/* Wyświetlanie rozdziałów */}
          {chapterEntries.map(([chapterKey, chapter], chapterIdx) => (
            <div key={chapterKey} style={{ border: "1px solid #999", borderRadius: "10px", padding: "15px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>{`${chapterIdx + 1}. ${chapter.title}`}</h2>
                <button onClick={() => handleRemoveChapter(chapterKey as ChapterKey)} style={{ background: "red", color: "white", border: "none", padding: "5px 10px" }}>
                  Usuń rozdział
                </button>
              </div>

              {/* Podrozdziały */}
              {Object.entries(chapter.content || {})
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([subChapterKey, paragraphs], subChapterIdx) => (
                  <div key={subChapterKey} style={{ marginTop: "15px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3>{`${chapterIdx + 1}.${subChapterIdx + 1}. ${availableChaptersData[chapterKey as ChapterKey].subchapters[subChapterKey as SubChapterKey]}`}</h3>
                      <button onClick={() => handleRemoveSubChapter(chapterKey as ChapterKey, subChapterKey as SubChapterKey)} style={{ background: "#f44336", color: "white", border: "none", padding: "2px 6px", fontSize: "12px" }}>
                        Usuń podrozdział
                      </button>
                    </div>

                    {(paragraphs || []).map((p, paraIdx) => {
                      const isEditing = editingParagraph?.chapterKey === chapterKey && editingParagraph.subChapterKey === subChapterKey && editingParagraph.index === paraIdx;

                      return (
                        <div key={paraIdx} style={{ paddingBottom: "5px", marginBottom: "5px", display: "flex", alignItems: "center" }}>
                          <strong>{`${chapterIdx + 1}.${subChapterIdx + 1}.${paraIdx + 1}. `}</strong>
                          
                          {isEditing ? (
                            <>
                              <textarea
                                value={editingParagraph.value}
                                onChange={(e) => setEditingParagraph(prev => prev ? { ...prev, value: e.target.value } : null)}
                                style={{ width: "100%", marginTop: "5px" }}
                              />
                              <div style={{ marginTop: "5px" }}>
                                <button onClick={() => saveEditedParagraph()} style={{ marginRight: "5px", padding: "3px 8px" }}>
                                  Zapisz
                                </button>
                                <button onClick={() => setEditingParagraph(null)} style={{ padding: "3px 8px" }}>
                                  Anuluj
                                </button>
                              </div>
                            </>
                          ) : (
                            <div style={{display: "flex", justifyContent: "space-between", width: "100%", marginLeft: "5px"}}>
                            {/* Wyświetlanie paragrafu */}
                            <div style = {{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                              {p}
                              
                            </div>
                            <div style={{ marginTop: "5px", marginBottom: "5px" }}>
                                <button onClick={() => startEditingParagraph(chapterKey as ChapterKey, subChapterKey as SubChapterKey, paraIdx, p)} style={{ marginRight: "5px", padding: "2px 6px", fontSize: "12px" }}>
                                  Edytuj
                                </button>
                                <button onClick={() => handleRemoveParagraph(chapterKey as ChapterKey, subChapterKey as SubChapterKey, paraIdx)} style={{ padding: "2px 6px", fontSize: "12px", background: "red", color: "white" }}>
                                  Usuń
                                </button>
                              </div>
                            </div>
                            
                          )}
                        </div>
                      );
                    })}

                    {/* Wybór szablonu */}
                    {!selectedTemplate && (
                        <select
                          value=""
                          onChange={(e) => {
                            setSelectedTemplate(e.target.value);
                            setCurrentChapterKey(chapterKey as ChapterKey);
                            setCurrentSubChapterKey(subChapterKey as SubChapterKey);
                          }}
                          style={{ width: "50%", marginTop: "10px" }}
                        >
                          <option value="">Wybierz szablon paragrafu</option>
                          {templates[subChapterKey as SubChapterKey].map((tpl, idx) => (
                            <option key={idx} value={tpl}>
                              {tpl === " " ? "(Pusty szablon)" : tpl}
                            </option>
                          ))}
                        </select>
                      
                    )}

                    {/* Formularz nowego paragrafu */}
                    {selectedTemplate && currentChapterKey === chapterKey && currentSubChapterKey === subChapterKey && (
                      <TemplateForm
                        template={selectedTemplate}
                        onSubmit={(finalText) => handleAddParagraph(currentChapterKey!, currentSubChapterKey!, finalText)}
                      />
                    )}
                  </div>
                ))}
              <div style={{ marginTop: "20px" }}><hr style={{ border: 'none', height: '1px', backgroundColor: 'white'}}/> </div>
               

              {/* Dodanie nowego podrozdziału */}
              <div style={{ marginTop: "20px" }}>
                <select
                  value={selectedSubChapters[chapterKey as ChapterKey] || ""}
                  onChange={(e) => {
                    const subKey = e.target.value as SubChapterKey;
                    if (subKey) handleAddSubChapter(chapterKey as ChapterKey, subKey);
                  }}
                  style={{ width: "100%" }}
                >
                  <option value="">Wybierz podrozdział do dodania</option>
                  {Object.keys(availableChaptersData[chapterKey as ChapterKey].subchapters)
                    .filter(subKey => !(subKey in (chapter.content || {})))
                    .sort()
                    .map(subKey => (
                      <option key={subKey} value={subKey}>
                        {availableChaptersData[chapterKey as ChapterKey].subchapters[subKey as SubChapterKey]}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          ))}

          {/* Podpisy */}
          <div style={{ textAlign: "right", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div/>
            <div style={{ marginTop: "40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "right" }}>
              <input
                type="text"
                value={signatureFirst}
                onChange={(e) => setSignatureFirst(e.target.value)}
                placeholder="Pozdrowienie"
                className="directive-signature"
              />
              <input
                type="text"
                value={signatureSecond}
                onChange={(e) => setSignatureSecond(e.target.value)}
                placeholder="Okrzyk"
                className="directive-signature"
              />
              {userData && (
                <div>
                  <div style={{textAlign: "right", marginTop: "10px" }}>{userData.function}</div>
                  <div style = {{textAlign: "right"}}>{userData.rank} {userData.firstname} {userData.surname}</div>
                </div>
              )}
            </div>
          </div>

          {/* Przycisk wysyłki */}
          <button
            onClick={handleSubmit}
            className="directive-submit"
          >
            Zapisz rozkaz
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewDirective;
