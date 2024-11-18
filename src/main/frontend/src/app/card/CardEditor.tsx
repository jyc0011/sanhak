import React, {useEffect, useState} from 'react';
import Card from './Card';
import ButtonLabel from '@/components/ButtonLabel';
import CardEditorFormSection from './CardEditorFormSection';
import Input from '@/components/Input';
import {AllKindOfSkills, Skill} from "@/models/skill";
import {AiCard} from "@/models/card";

type CardEditorProps = {
  selectedCard: AiCard | null,
  onCancel: () => void,
  onCreate: (card: any) => void,
  onModify: (card: any) => void,
};

// TODO: API 연결 
const allCategorySkills: AllKindOfSkills[] = [
  { category:"frontend",
    skills: [
    { id: 1, name: 'HTML' }, 
    { id: 2, name: 'CSS' },
    { id: 3, name: 'JavaScript' },
    { id: 4, name: 'TypeScript' },
  ]},
  { category:"backend",
    skills: [
    { id: 5, name: 'Tailwind' },
    { id: 6, name: 'Bootstrap' },
    { id: 7, name: 'React' },
    { id: 8, name: 'Angular' },
    { id: 9, name: 'Vue.js' },
  ]},
  { category:"data",
    skills: [
    { id: 10, name: 'SASS' },
    { id: 11, name: 'React Hooks' }, 
    { id: 12, name: 'Redux' }, 
    { id: 13, name: 'Recoil' },
    { id: 14, name: 'RxJS' },
    { id: 15, name: 'VueX' }, 
    { id: 16, name: 'Pinia' },
    { id: 17, name: 'Vite' },
  ]},
  { category:"security",
    skills: [
    { id: 22, name: 'Webpack' },
    { id: 23, name: 'GraphQL' },
  ]},
  { category:"application",
    skills: [
    { id: 24, name: 'Cypress' }, 
    { id: 25, name: 'Jest' },
    { id: 26, name: 'MobX' },
    { id: 27, name: 'Android Studio' },
      { id: 28, name: 'Kotlin' },
      { id: 29, name: 'Python' },
      { id: 30, name: 'Flask' },
      { id: 31, name: 'AWS' },
      { id: 32, name: 'Ubuntu' },
    ]},
];

// TODO: API 연결
const allTools: Tool[] = [
  { id: 1, name: "github" },
  { id: 2, name: "figma" },
];

const categories = ['frontend', 'backend', 'data', 'security', 'application'];
export default function CardEditor({
  onCreate,
  onModify,
  onCancel,
  selectedCard
}: CardEditorProps) {
  const [card, setCard] = useState<AiCard | null>(selectedCard);
  const isNewCard = selectedCard ? false : true;
  const [buttonStyles, setButtonStyles] = useState(Array(categories.length).fill('border-primary'));
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false); // 로딩

  // 1. 제목과 기간
  const handlerTitleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCard(prevCard => ({
      ...prevCard,
      title: event.target.value,
    }))
  }
  const handlerFromDateInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCard(prevCard => ({
      ...prevCard,
      fromDate: event.target.value
    }))
  }
  const handlerToDateInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCard(prevCard => ({
      ...prevCard,
      toDate: event.target.value
    }))
  }

  // 2. 카테고리
  useEffect(() => {
    if (card?.category) {
      const newStyles = categories.map(c =>
        card.category?.includes(c) ? '' : 'border-primary'
      );
      setButtonStyles(newStyles);
    }
  }, [card?.category, categories]);

  const handleCategoryClick = (index: number) => {
    const newStyles = [...buttonStyles];
    newStyles[index] = newStyles[index] === '' ? 'border-primary' : '';
    setButtonStyles(newStyles);

    const category = categories[index];

    setCard(prevCard => {
      const currentCategories = prevCard?.category || [];
      const updatedCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
      return {
        ...prevCard,
        category: updatedCategories
      }
    })
  };

  // 3. 언어와 스킬
  useEffect(() => {
    const filteredSkills = allCategorySkills
      .filter(skill => card?.category?.includes(skill.category)) 
      .flatMap(skill => skill.skills); 

    setSelectedSkills(filteredSkills);
  }, [card?.category]);
  
  const handleSkillClick = (skill: Skill) => {
    setCard(prevCard => {
      const currentSkills = prevCard?.skills || [];
      const updatedSkills = currentSkills.some(s=> skill.id === s.id)
        ? currentSkills.filter(s => s.id !== skill.id)
        : [...currentSkills, skill];
      
      return {
        ...prevCard,
        skills: updatedSkills
      };
    });
  };

  // 4 개발 도구
  const handleToolClick = (tool: Tool) => {
    setCard(prevCard => {
      const currentTools = prevCard?.tools || [];
      const updatedTools = currentTools.some(t => tool.id === t.id)
      ? currentTools.filter(t => t.id !== tool.id)
      : [...currentTools, tool];

      return {
        ...prevCard,
        tools: updatedTools
      }
    })
  }
 
  // 5. 경험 회고
  const handlerReflectionInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCard(prevCard => ({
      ...prevCard,
      reflection: event.target.value
    }))
  }

  // 6. 경험 이미지 업로드
  // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     setCard(prevCard => ({
  //       ...prevCard,
  //       imageFile : file,
  //       imageUrl: `/asset/png/profile/${file.name}`
  //     }))
  //   }
  // };

  // 6. pdf 참고자료
  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCard(prevCard => ({
        ...prevCard,
        pdfFile:file,
        pdfName: file.name
      }));
    }
  };
  
  // 7. 소스 URL
  const handleSourceUrlInput = (index: number, value: string) => {
    setCard(prevCard => {
      const newSourceUrl = [...(prevCard?.sourceUrl || [])];
      newSourceUrl[index] = value;
      return {
        ...prevCard,
        sourceUrl: newSourceUrl
      };
    });
  };

  // 8. AI 이미지
  const getRandomImageUrl = (): string => {
    const randomIndex = Math.floor(Math.random() * 20) + 1; 
    return `/asset/png/card/card_img_${randomIndex}.png`; // 경로 수정
  };
  const fetchImageAsFile = async (imageUrl: string): Promise<File | null> => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob(); // Blob으로 변환
      const file = new File([blob], 'card_image.png', { type: blob.type }); // File 객체 생성
      return file;
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  };

  const handleSaveClick = async () => { // 비동기로 변경
    if (isNewCard) {
      const randomImageUrl = getRandomImageUrl(); // 랜덤 이미지 URL 생성
      const imageFile = await fetchImageAsFile(randomImageUrl);

      // 카드 상태 업데이트
      setCard(prevCard => ({
        ...prevCard,
        imageUrl: randomImageUrl,
        imageFile: imageFile,
      }));

      // 카드 생성 호출
      if (imageFile) { 
        onCreate({ ...card, imageFile });
      }
    } else {
      onModify(card);
    }
  };

  const handleCancelClick = () => {
    onCancel();
  }

  // 디버깅용
  useEffect(()=> {
    console.log(card);
    console.log(isNewCard);
  }, [card]);
  
  return (
    <div className='w-full h-full flex flex-row justify-between px-24'>
      <div className='w-[65%] h-full flex flex-col items-end'>
        <CardEditorFormSection title="경험의 제목과 기간을 입력해주세요">
          <div className='flex flex-row w-full justify-around mb-2'>
            <div className='w-1/6 mr-2 text-sm rounded-xl border-gray-d9 bg-primary font-semibold text-white flex justify-center items-center'>경험 제목</div>
            <div className='w-5/6'>
              <Input 
                type='text'
                className='w-full rounded-xl border-gray-d9 text-sm focus:outline-0'
                placeholder='제목을 입력해주세요'
                value={card?.title}
                onChange={handlerTitleInput}
              />
            </div>
          </div>
          <div className='flex flex-row w-full justify-around'>
            <div className='w-1/6 mr-2 text-sm rounded-xl border-gray-d9 bg-primary font-semibold text-white flex justify-center items-center'>기간</div>
            <div className='w-5/6 flex flex-row'>
              <div className='flex flex-row w-1/6'>
                <Input 
                  type='text'
                  className='w-full rounded-xl border-gray-d9 text-sm focus:outline-0'
                  placeholder='YYYY-MM-DD'
                  value={card?.fromDate}
                  onChange={handlerFromDateInput}
                />
              </div>
              <div className='flex text-2xl text-gray-d9 justify-center items-center mx-2'>&#126;</div>
              <div className='flex flex-row w-1/6'>
                <Input 
                  type='text'
                  className='w-full rounded-xl border-gray-d9 text-sm focus:outline-0'
                  placeholder='YYYY-MM-DD'
                  value={card?.toDate}
                  onChange={handlerToDateInput}
                />
              </div>
            </div>
          </div>
        </CardEditorFormSection>
        { card?.title && card?.fromDate && card?.toDate && card?.title.length > 0 && (
          <CardEditorFormSection title="내가 맡았던 역할은 무엇인가요?">
            <div className='flex flex-row w-full justify-between'>
              {categories.map((c, index) => (
                <ButtonLabel 
                  key={c}
                  type="category" 
                  label={c} 
                  style={buttonStyles[index]}
                  onClick={() => handleCategoryClick(index)}
                />
              ))}
            </div>
          </CardEditorFormSection>
        )}
        { card?.category && card?.category.length > 0 && (
          <CardEditorFormSection title="어떤 언어와 스킬을 경험해보았나요?">
            <div className='flex flex-row w-full flex-wrap'>
              {selectedSkills.map(s => (
                <ButtonLabel 
                  key={s.id} 
                  type="skill" 
                  label={s.name} 
                  style={card?.skills?.some(skill => skill.id === s.id) ? '' : 'border-primary'}
                  onClick={()=>handleSkillClick(s)}
                />
              ))}
            </div>
          </CardEditorFormSection>
        )}
        { card?.skills && card?.skills.length > 0 && (
          <CardEditorFormSection title="어떤 개발 도구를 경험해보았나요?">
            <div className='flex flex-row w-full flex-wrap'>
              {allTools.map(t => (
                <ButtonLabel 
                  key={t.id} 
                  type="tool" 
                  label={t.name} 
                  style={card?.tools?.some(tool => tool.id === t.id) ? '' : 'border-primary'}
                  onClick={()=>handleToolClick(t)}
                />
              ))}
            </div>
          </CardEditorFormSection>
        )}
        { card?.tools && card?.tools.length > 0 && (
          <CardEditorFormSection title="이번 경험에 대하여">
            <textarea
              className='w-full h-52 rounded-xl border-gray-d9 text-sm focus:outline-0 p-3'
              value={card?.reflection}
              placeholder='느낀점, 배운점, 더 알아보고 싶은 점 등 자유롭게 적어주세요'
              style={{ textAlign: 'left', verticalAlign: 'top' }}
              onChange={handlerReflectionInput}
            />
          </CardEditorFormSection>
        )}
        {/* { card?.reflection && card?.reflection.length > 0 && (
          <CardEditorFormSection title="사진으로 경험을 보여주세요">
            <div className='w-full flex'>
              <label className='cursor-pointer inline-flex items-center mr-4 py-2 px-4 rounded-lg border-0 text-sm font-semibold bg-primary text-white'>
                <Input 
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleImageUpload}
                />
                파일 선택
              </label>
              {card?.imageUrl && (
                <div className="mt-2 font-semibold">{card?.imageUrl}</div> 
              )}
            </div>
            {card?.imageUrl && (
              <img
                src={card?.imageUrl}
                alt="Preview"
                className="mt-4 w-1/2 h-1/2 object-cover border border-gray-d9 rounded-xl"
              />
            )}
          </CardEditorFormSection>
        )} */}
        { card?.reflection && card?.reflection.length > 0 && (
          <CardEditorFormSection title="경험을 가장 잘 보여주는 자료(.pdf)">
            <div className='w-full flex'>
              <label className="cursor-pointer inline-flex items-center mr-4 py-2 px-4 rounded-lg border-0 text-sm font-semibold bg-primary text-white">
                <Input 
                  type='file'
                  accept='.pdf'
                  className='hidden'
                  onChange={handlePdfUpload}
                />
                파일 선택
              </label>
              {card?.pdfFile && (
                <div className="mt-2 font-semibold">{card?.pdfName}</div>
              )}
            </div>
          </CardEditorFormSection>
        )}
        { card?.pdfName && card?.pdfName.length > 0 && (
          <CardEditorFormSection title="경험을 보여주는 소스 URL을 입력해주세요">
            {[0, 1].map(index => (
              <Input 
                key={index}
                value={card?.sourceUrl?.[index]}
                type='text'
                className='w-full mb-2 rounded-xl border-gray-d9 text-sm focus:outline-0'
                placeholder='ex) Github, Figma, ...'
                onChange={(e) => handleSourceUrlInput(index, e.target.value)}
              />
            ))}
          </CardEditorFormSection>
        )}
      </div>
      <div className='w-1/3 flex flex-col items-center'>
        <div className='fixed'>
          <Card card={card}/>
          {card?.sourceUrl && card?.sourceUrl.length > 0 ? (
            <div
              className='cursor-pointer w-full flex justify-center font-semibold bg-primary text-white border-2 border-primary hover:text-primary hover:bg-white px-4 py-2 mt-2 rounded-xl'
              onClick={handleSaveClick}
            >
              {isNewCard ? 'AI경험카드 생성하기' : 'AI경험카드 수정하기'}
            </div>
          ) :
          (
            <div
              className='cursor-pointer w-full flex justify-center font-semibold bg-primary text-white border-2 border-primary hover:text-primary hover:bg-white px-4 py-2 mt-2 rounded-xl'
              onClick={handleCancelClick}
            >
             {'AI경험카드 관리 돌아가기'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}