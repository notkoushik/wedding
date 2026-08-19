import { useState } from 'react'

import gorentakuImg from '../../assets/aestatics/gorentaku.jpg'
import vrathamImg from '../../assets/aestatics/vratham.jpg'
import eadurukoluImg from '../../assets/aestatics/eadurukolu.jpg'
import varamaluImg from '../../assets/aestatics/varamalu.jpg'
import thalambraluImg from '../../assets/aestatics/thalambraly.jpg'
import sapthipadhiImg from '../../assets/aestatics/sapthipadhi.jpg'
import coupleCartoonImg from '../../assets/aestatics/head reshaped image.jpg'

interface RitualStory {
  id: string
  number: string
  titleTelugu: string
  titleEnglish: string
  shloka: string
  significanceTelugu: string
  significanceEnglish: string
  culturalDetailsTelugu: string[]
  culturalDetailsEnglish: string[]
  image: string
}

const RITUAL_STORIES: RitualStory[] = [
  {
    id: 'gorentaku',
    number: '01',
    titleTelugu: 'గోరింటాకు',
    titleEnglish: 'Gorentaku — Auspicious Henna Ceremony',
    shloka: 'కరకమల సుందరం · సౌభాగ్య వర్ధనం',
    significanceTelugu:
      'వివాహ వేడుకల్లో గోరింటాకు ఎంతో పవిత్రమైనది. వధువు చేతులకు ఎంత ఎర్రగా పండితే, అంతటి ప్రేమానురాగాలు, అదృష్టం, ఆనందం చేకూరుతాయని పెద్దల నమ్మకం.',
    significanceEnglish:
      'The application of intricate, fragrant herbal henna on the bride’s hands and feet is an ancient Vedic tradition celebrating beauty, health, and auspicious beginnings. In Telugu culture, the deeper the reddish stain, the greater the love, prosperity, and joy between the bride and her husband.',
    culturalDetailsTelugu: [
      'మహిళలందరూ కలసి పాడే మంగళ హారతుల నడుమ సాగే వేడుక',
      'శరీరానికి చలువ చేసి మనస్సుకు ప్రశాంతతను ఇచ్చే ఆయుర్వేద సంప్రదాయం',
      'సౌభాగ్యానికి, ఆయురారోగ్యాలకు పవిత్ర సూచిక',
    ],
    culturalDetailsEnglish: [
      'Celebrated amidst traditional songs, laughter, and blessings from women of the family',
      'A natural Ayurvedic herb that cools the bride’s body and relieves wedding stress',
      'A timeless symbol of marital fortune, beauty, and emotional bonding',
    ],
    image: gorentakuImg,
  },
  {
    id: 'vratham',
    number: '02',
    titleTelugu: 'గౌరీ పూజ & వ్రతం',
    titleEnglish: 'Gauri Pooja & Vratham — Sacred Pre-Wedding Vows',
    shloka: 'సర్వమంగళ మాంగల్యే శివే సర్వార్థ సాధికే',
    significanceTelugu:
      'వివాహానికి పూర్వ రంగంగా వధూవరులు విడివిడిగా జరిపే పవిత్ర వ్రతాలు. వధువు గౌరీదేవిని, వరుడు ఇష్టదైవాన్ని పూజించి సంపూర్ణ దాంపత్య సుఖాన్ని ప్రార్థిస్తారు.',
    significanceEnglish:
      'Before proceeding to the wedding mandapam, the bride performs Gauri Pooja worshipping Goddess Gauri (symbolizing the ideal devoted wife and mother), while the groom performs sacred Vrathams to transition from bachelorhood into a responsible family life (Grihastha Ashram).',
    culturalDetailsTelugu: [
      'ఆదర్శ దాంపత్యానికి గౌరీ-శంకరుల అనుగ్రహం కోరే విశిష్ట పూజ',
      'మనస్సును, దేహాన్ని పవిత్రం చేసి పెండ్లి పీటలకు సిద్ధం చేసే క్రతువు',
      'పెద్దల సమక్షంలో జరిగే సంప్రదాయ సంకల్పం',
    ],
    culturalDetailsEnglish: [
      'Invocation of Goddess Parvati and Lord Shiva for lifelong loyalty and spiritual strength',
      'Spiritual purification ritual preparing the mind and soul for the sacred marriage rites',
      'Performed with Vedic chants under the loving guidance of parents and elders',
    ],
    image: vrathamImg,
  },
  {
    id: 'eadurukolu',
    number: '03',
    titleTelugu: 'ఎదురుకోలు',
    titleEnglish: 'Edurukolu — The Grand Welcoming',
    shloka: 'అతిథి దేవో భవ · సాదర సంభాషణ',
    significanceTelugu:
      'బాజాభజంత్రీలు, పూలదండలు, మంగళ హారతులతో వధువు కుటుంబం వరుడి పరివారాన్ని సాదరంగా ఆహ్వానించి గౌరవించే ఆనందమయ ఘట్టం.',
    significanceEnglish:
      'Edurukolu marks the joyous ceremonial welcome where the bride’s family steps forward to greet the groom and his wedding procession (Baraat). Accompanied by traditional Shehnai and Nadaswaram instruments, rosewater, and auspicious Aarti, this ritual cements the bond between both families.',
    culturalDetailsTelugu: [
      'రెండు కుటుంబాల ఆత్మీయ కలయికకు తొలి మధుర ఘట్టం',
      'హాస్య చతురోక్తులు, బంధువుల కోలాహలంతో నిండిన సంబరం',
      'వరుడికి మంగళహారతులు ఇచ్చి సత్కరించే ఆచారం',
    ],
    culturalDetailsEnglish: [
      'The initial formal meeting uniting two families in mutual affection and respect',
      'Filled with cheerful playful banter, floral showering, and traditional songs',
      'Ceremonial Harathi performed to ward off negative energies before entering the mandapam',
    ],
    image: eadurukoluImg,
  },
  {
    id: 'varamalu',
    number: '04',
    titleTelugu: 'వరమాల',
    titleEnglish: 'Varamala — Exchange of Floral Garlands',
    shloka: 'సమగ్ర హృదయైక్యమ్ · పరస్పర వరణం',
    significanceTelugu:
      'సుముహూర్త వేళ వధూవరులు ఒకరికొకరు సుగంధ భరిత పుష్పమాలలు సమర్పించుకుంటూ, పరస్పరం హృదయపూర్వకంగా జీవిత భాగస్వామిగా స్వీకరించే వేడుక.',
    significanceEnglish:
      'Standing face-to-face at the altar, the bride and groom garland each other with fresh, fragrant flowers. This pivotal ceremony publicly declares their mutual consent, devotion, and willingness to share all the fragrance and responsibilities of life together as equals.',
    culturalDetailsTelugu: [
      'బంధుమిత్రుల హర్షధ్వానాల నడుమ జరిగే ఉల్లాసభరిత ఘట్టం',
      'ఒకరినొకరు సమానంగా గౌరవిస్తూ ముందుకు సాగే ప్రయాణం',
      'పూల సువాసనల వలె జీవితం పరిమళించాలనే ఆకాంక్ష',
    ],
    culturalDetailsEnglish: [
      'Conducted amidst joyful cheering and clapping from family and friends',
      'Signifies mutual respect and lifelong equality in partnership',
      'A prayer that their matrimonial journey remains fragrant like fresh blossoms',
    ],
    image: varamaluImg,
  },
  {
    id: 'thalambralu',
    number: '05',
    titleTelugu: 'తలంబ్రాలు',
    titleEnglish: 'Talambralu — Sacred Shower of Pearls & Turmeric',
    shloka: 'ధాన్య లక్ష్మీ ప్రసన్నాస్తు · ఆనంద వర్షం',
    significanceTelugu:
      'ముత్యాలు, పసుపు కలిపిన అక్షతలను వధూవరులు ఒకరి తలపై ఒకరు పరస్పరం ఆనందంతో కురిపించుకునే అత్యంత మనోహరమైన, సరదాగా సాగే ఘట్టం.',
    significanceEnglish:
      'The most vibrant and cherished highlight of a Telugu wedding! The couple joyfully pours golden turmeric rice, pearls, and saffron grains over each other’s heads, starting slowly and escalating into an affectionate, celebratory shower praying for abundance, harmony, and laughter.',
    culturalDetailsTelugu: [
      'తెలుగు వివాహ సంప్రదాయంలో అత్యంత ప్రజాదరణ పొందిన ఘట్టం',
      'నవ్వులు, కేరింతలు, ఆత్మీయుల ఉత్సాహభరిత సమక్షం',
      'సుఖశాంతులు, ధనధాన్యాలతో ఇల్లు వర్ధిల్లాలనే ప్రార్థన',
    ],
    culturalDetailsEnglish: [
      'The pinnacle of joy and playful intimacy in South Indian Telugu ceremonies',
      'Surrounded by laughter and playful encouragement from both family sides',
      'An ancient Vedic prayer invoking Goddess Lakshmi for health, grains, and wealth',
    ],
    image: thalambraluImg,
  },
  {
    id: 'sapthipadhi',
    number: '06',
    titleTelugu: 'సప్తపది',
    titleEnglish: 'Saptapadi — Seven Sacred Steps Around Agni',
    shloka: 'సఖా సప్తపదా భవ · సఖ్యంతే గమేయమ్',
    significanceTelugu:
      'పవిత్ర అగ్నిహోత్రం సాక్షిగా వధూవరులు ఏడు అడుగులు వేస్తూ ఆహారం, బలం, ధనం, సుఖం, సంతానం, ఋతుధర్మాలు, ఆత్మీయ స్నేహం కోసం ప్రతిజ్ఞలు చేస్తారు.',
    significanceEnglish:
      'The most sacred and legally binding rite in Hindu matrimony. Holding hands with their garments tied together (Brahma Mudi), the couple takes seven holy steps clockwise around the sacred Agni fire, making seven lifelong promises for nutrition, strength, prosperity, joy, children, wisdom, and eternal friendship.',
    culturalDetailsTelugu: [
      'హిందూ వివాహ వ్యవస్థలో సర్వోన్నతమైన ప్రధాన వైదిక ఘట్టం',
      'మంత్రోచ్ఛారణల నడుమ దైవసాక్షిగా జరిగే వివాహ బంధం',
      'జీవితాంతం కలిసుంటామని చేసే పవిత్ర వాగ్దానం',
    ],
    culturalDetailsEnglish: [
      'The supreme Vedic ceremony where the marriage is consecrated in the presence of Fire (Agni Dev)',
      'Each step seals a specific covenant: sustenance, health, wealth, family, and spiritual harmony',
      'Culminates in the eternal blessing: "With seven steps, we have become true lifelong companions"',
    ],
    image: sapthipadhiImg,
  },
]

export function TeluguRitualsSection() {
  const [activeModalImg, setActiveModalImg] = useState<string | null>(null)

  return (
    <section
      id="rituals"
      className="relative py-20 sm:py-28 md:py-32"
      style={{
        backgroundColor: '#E8DCCA',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* ── Section Header (Clean, Serene & High Aesthetic) ── */}
        <div className="text-center space-y-2 mb-20 sm:mb-28">
          <p className="font-telugu text-[#6b1212] text-xs sm:text-sm tracking-[0.2em] font-semibold">
            || శ్రీరస్తు · శుభమస్తు · అవిఘ్నమస్తు ||
          </p>
          <h2 className="font-calligraphy text-crimson text-3xl sm:text-4xl md:text-5xl font-bold">
            Sacred Telugu Traditions
          </h2>
          <p className="font-telugu text-[#4a0808] text-base sm:text-lg font-medium">
            సాంప్రదాయ వివాహ ఘట్టాల విశిష్టత
          </p>
          <div className="w-16 h-[1px] bg-[#9b7b1b] mx-auto mt-3 opacity-60" />
        </div>

        {/* ── 1. Featured Couple Illustration ── */}
        <div className="max-w-2xl mx-auto mb-24 sm:mb-32 flex flex-col md:flex-row items-center gap-8 sm:gap-12">
          <div
            className="w-48 sm:w-56 md:w-60 flex-shrink-0 cursor-pointer group hover:scale-102 transition-transform duration-500"
            onClick={() => setActiveModalImg(coupleCartoonImg)}
          >
            <img
              src={coupleCartoonImg}
              alt="Mohan Praneeth & Leepika"
              className="w-full h-auto object-contain mix-blend-multiply drop-shadow-sm"
            />
          </div>

          <div className="text-center md:text-left space-y-2">
            <h3 className="font-telugu font-bold text-crimson text-2xl sm:text-3xl">
              మోహన్ ప్రణీత్ &amp; లీపిక
            </h3>
            <p className="font-display font-medium text-gold-dark text-sm sm:text-base tracking-wide">
              Mohan Praneeth &amp; Leepika
            </p>
            <p className="font-telugu text-[#4a0808] text-xs sm:text-sm leading-relaxed pt-1">
              తెలుగు వివాహ సంస్కృతి ఎంతో మహోన్నతమైనది. ప్రతి ఘట్టం వెనుక ఒక పవిత్రమైన అంతరార్థం, జీవితాంతం నిలిచే బంధానికి వేసే పటిష్టమైన పునాది దాగి ఉంది.
            </p>
            <p className="font-display italic text-[#633a3a] text-xs sm:text-[13px] leading-relaxed">
              "A timeless celebration of sacred customs, uniting two souls in eternal companionship, love, and dharma."
            </p>
          </div>
        </div>

        {/* ── 2. Clean Editorial Storytelling Flow for the 6 Rituals ── */}
        <div className="space-y-24 sm:space-y-36">
          {RITUAL_STORIES.map((ritual, index) => {
            const isEven = index % 2 === 1

            return (
              <div
                key={ritual.id}
                className={`flex flex-col ${
                  isEven ? 'md:flex-row-reverse' : 'md:flex-row'
                } items-center gap-8 sm:gap-14 md:gap-18`}
              >
                {/* ── Artwork Illustration (Seamless on #E8DCCA) ── */}
                <div className="w-full md:w-5/12 flex justify-center">
                  <div
                    onClick={() => setActiveModalImg(ritual.image)}
                    className="w-full max-w-[280px] sm:max-w-xs cursor-pointer group hover:scale-102 transition-transform duration-500"
                  >
                    <img
                      src={ritual.image}
                      alt={ritual.titleTelugu}
                      className="w-full h-auto object-contain mix-blend-multiply drop-shadow-sm"
                    />
                  </div>
                </div>

                {/* ── Story Narrative ── */}
                <div className="w-full md:w-7/12 text-center md:text-left space-y-3">
                  
                  {/* Step Index & Shloka */}
                  <div className="flex items-center justify-center md:justify-start gap-2 text-xs">
                    <span className="font-display font-bold text-crimson tracking-widest uppercase">
                      — {ritual.number} —
                    </span>
                    <span className="text-[#9b7b1b]">·</span>
                    <span className="font-telugu text-[#6b1212] font-semibold text-xs">
                      {ritual.shloka}
                    </span>
                  </div>

                  {/* Title & English Subtitle */}
                  <div>
                    <h3 className="font-telugu font-bold text-crimson text-2xl sm:text-3xl md:text-3xl">
                      {ritual.titleTelugu}
                    </h3>
                    <p className="font-display font-medium text-[#7a4a4a] text-xs sm:text-[13px] tracking-wider uppercase">
                      {ritual.titleEnglish}
                    </p>
                  </div>

                  {/* Telugu Significance */}
                  <p className="font-telugu text-[#3a0505] text-xs sm:text-sm leading-relaxed pt-1">
                    {ritual.significanceTelugu}
                  </p>

                  {/* English Significance */}
                  <p className="font-body text-[#4d2626] text-xs sm:text-[13px] leading-relaxed">
                    {ritual.significanceEnglish}
                  </p>

                  {/* Cultural Details */}
                  <div className="pt-2 space-y-1 text-left inline-block">
                    {ritual.culturalDetailsTelugu.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2 text-xs font-telugu text-[#5c0a0a]">
                        <span className="text-[#9b7b1b] text-xs mt-0.5">✦</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )
          })}
        </div>

      </div>

      {/* ── 3. HD Lightbox Modal ── */}
      {activeModalImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md cursor-pointer transition-opacity duration-300"
          onClick={() => setActiveModalImg(null)}
        >
          <div
            className="relative max-w-lg w-full p-4 sm:p-6 rounded-2xl shadow-2xl my-auto cursor-default border border-gold/40"
            style={{ backgroundColor: '#E8DCCA' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end pb-2">
              <button
                onClick={() => setActiveModalImg(null)}
                className="w-7 h-7 rounded-full bg-crimson text-white flex items-center justify-center text-xs hover:bg-crimson-dark transition-all"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto max-h-[80vh] flex justify-center py-1">
              <img
                src={activeModalImg}
                alt="Telugu Ritual Artwork"
                className="w-full h-auto object-contain mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
