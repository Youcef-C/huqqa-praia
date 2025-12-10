'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Box, Button, Typography, Container, Grid, Paper, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function HomePage() {
  const t = useTranslations('HomePage');
  const locale = useLocale();

  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [heroConfig, setHeroConfig] = useState<any | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/events`)
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/hero`)
      .then(res => res.json())
      .then(data => setHeroConfig(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, pb: 2, bgcolor: 'background.default' }}>
      {/* Hero Section */}

      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden' // Ensure video doesn't overflow
        }}
      >
        {/* Background Video Layer */}
        {heroConfig?.videoUrl && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            overflow: 'hidden'
          }}>
            <video
              src={heroConfig.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'blur(8px)', // Blur effect
                transform: 'scale(1.1)' // Slight scale to avoid blurred edges showing white bg
              }}
            />
            {/* Dark overlay to ensure text readability on top of video */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(0,0,0,0.5)'
            }} />
          </Box>
        )}

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          {/* Logo - larger and more prominent */}
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Box sx={{
              width: { xs: 600, md: 600 },
              height: { xs: 180, md: 250 },
              position: 'relative',
            }}>
              <Image
                src="/assets/logo.png"
                alt="Logo"
                fill
                style={{ objectFit: 'contain', mixBlendMode: 'screen' }}
              />
            </Box>
          </Box>
          <Typography variant="h2" component="h1" gutterBottom sx={{
            fontWeight: 800,
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '0.2rem',
            mb: 2
          }}>
            {t('title')}
          </Typography>
          <Typography variant="h5" gutterBottom sx={{
            color: 'primary.main',
            mb: 6,
            fontWeight: 400,
            letterSpacing: '0.1rem',
            textTransform: 'uppercase'
          }}>
            {t('subtitle')}
          </Typography>

          {/* Call to Action */}
          <Box sx={{ mt: 4, display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/reservation" style={{ textDecoration: 'none' }}>
              <Button variant="contained" size="large" sx={{
                bgcolor: '#d4af37',
                color: 'black',
                px: 5, py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 700,
                '&:hover': { bgcolor: '#b4941f' }
              }}>
                {t('bookTable')}
              </Button>
            </Link>
            <Link href="/menu" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" size="large" sx={{
                color: 'white',
                borderColor: '#d4af37',
                borderWidth: '2px',
                px: 5, py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 700,
                '&:hover': { borderColor: '#b4941f', borderWidth: '2px', bgcolor: 'rgba(212, 175, 55, 0.1)' }
              }}>
                {t('viewMenu')}
              </Button>
            </Link>
          </Box>


        </Container>
      </Box>

      {/* Events / Highlights Section */}
      {/* <Container id="events-section" maxWidth="xl" sx={{ mt: 5, mb: 5 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" sx={{ color: '#d4af37', letterSpacing: '0.3em', fontWeight: 700 }}>
            {t('happeningNow')}
          </Typography>
          <Typography variant="h2" component="h2" gutterBottom sx={{
            color: 'white',
            textTransform: 'uppercase',
            fontWeight: 800,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            letterSpacing: '0.1em'
          }}>
            {t('upcomingEvents')}
          </Typography>
        </Box>

        <Box sx={{
          px: { xs: 2, md: 4 },
          // Custom Swiper Styles for Pagination
          '& .swiper-pagination-bullet': {
            bgcolor: 'gray',
            opacity: 0.5,
          },
          '& .swiper-pagination-bullet-active': {
            bgcolor: '#d4af37', // Gold color
            opacity: 1,
          }
        }}>
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            speed={1000} // Slower transition (1s)
            autoplay={{
              delay: 5000, // Slower interval (5s)
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            modules={[Autoplay, Pagination, Navigation]}
            style={{ paddingBottom: '50px', paddingLeft: '10px', paddingRight: '10px' } as any}
          >
            {events.map((event: any) => (
              <SwiperSlide key={event.id}>
                <Box
                  onClick={() => setSelectedEvent(event)}
                  sx={{
                    position: 'relative',
                    height: 500, // Fixed height for portrait look
                    width: '100%',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    border: '1px solid #333',
                    transition: 'all 0.4s ease',
                    '&:hover': {
                      borderColor: '#d4af37',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                      '& .event-overlay': {
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
                      }
                    }
                  }}
                >
                  {event.image && (
                    <Box className="event-image" sx={{ position: 'relative', width: '100%', height: '100%', transition: 'transform 0.6s ease' }}>
                      <Image
                        src={event.image && (event.image.startsWith('/') || event.image.startsWith('http') || event.image.startsWith('data:')) ? event.image : `/assets/${event.image || 'default_event.jpg'}`}
                        alt={event.titleFr}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>
                  )}
                  <Box className="event-overlay" sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 10%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)',
                    transition: 'background 0.4s ease'
                  }} />

                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    p: 4,
                    color: 'white'
                  }}>
                    <Box sx={{
                      display: 'inline-block',
                      bgcolor: '#d4af37',
                      color: 'black',
                      px: 2,
                      py: 0.5,
                      mb: 2,
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      letterSpacing: '0.1em'
                    }}>
                      {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toUpperCase()}
                    </Box>

                    <Typography variant="h4" sx={{
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      mb: 1,
                      lineHeight: 1,
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                      {locale === 'pt' ? event.titlePt : (locale === 'en' ? event.titleEn : event.titleFr)}
                    </Typography>

                    <Typography variant="body2" sx={{
                      color: 'rgba(255,255,255,0.8)',
                      display: '-webkit-box',
                      WebkitLineClamp: 1, // Limit to 1 line
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {(locale === 'pt' ? event.descriptionPt : (locale === 'en' ? event.descriptionEn : event.descriptionFr))?.split('\n')[0]}
                    </Typography>
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Container> */}

      {/* Event Popup Modal */}
      {/* <Modal
        open={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{
          position: 'relative',
          width: { xs: '95vw', md: '80vw' },
          height: { xs: '90vh', md: '80vh' },
          bgcolor: '#121212',
          outline: 'none',
          border: '1px solid #d4af37',
          p: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }
        }}>
          {selectedEvent && (
            <>
              <IconButton
                onClick={() => setSelectedEvent(null)}
                sx={{ position: 'absolute', top: 10, right: 10, color: 'white', zIndex: 10, bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}>
                <CloseIcon />
              </IconButton>

              <Box sx={{
                position: 'relative',
                width: { xs: '100%', md: '60%' },
                height: { xs: '40%', md: '100%' },
                borderRight: { md: '1px solid #333' }
              }}>
                {selectedEvent.image && (
                  <Image
                    src={selectedEvent.image && (selectedEvent.image.startsWith('/') || selectedEvent.image.startsWith('http') || selectedEvent.image.startsWith('data:')) ? selectedEvent.image : `/assets/${selectedEvent.image || 'default_event.jpg'}`}
                    alt={selectedEvent.titleFr}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                )}
              </Box>

              <Box sx={{
                width: { xs: '100%', md: '40%' },
                height: { xs: '60%', md: '100%' },
                p: { xs: 3, md: 5 },
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto'
              }}>
                <Typography variant="overline" sx={{ color: '#d4af37', letterSpacing: '0.2em', fontWeight: 700, mb: 1 }}>
                  {new Date(selectedEvent.date).toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
                </Typography>

                <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, textTransform: 'uppercase', mb: 3, lineHeight: 1.1 }}>
                  {locale === 'pt' ? selectedEvent.titlePt : (locale === 'en' ? selectedEvent.titleEn : selectedEvent.titleFr)}
                </Typography>

                <Box sx={{ width: '50px', height: '3px', bgcolor: '#d4af37', mb: 4 }} />

                <Typography variant="body1" sx={{ color: '#ccc', lineHeight: 1.8, fontSize: '1.1rem', whiteSpace: 'pre-line' }}>
                  {locale === 'pt' ? selectedEvent.descriptionPt : (locale === 'en' ? selectedEvent.descriptionEn : selectedEvent.descriptionFr)}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Modal> */}

    </Box>
  );
}
