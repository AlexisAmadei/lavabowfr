import React, { useState, useEffect } from 'react'
import Section from '@/components/Design/Section'
import LavaTypo from '@/components/Design/LavaTypo'
import PicFrame from './PicFrame'
import { Box } from '@chakra-ui/react'

const event = [
    {
        title: 'Concert Lava Bow',
        image: '/src/assets/img/pictures-section/sample.png',
        date: '20/03/2025',
        description: 'Une soirée musicale exceptionnelle avec Lava Bow. Découvrez leurs derniers titres dans une ambiance intimiste et chaleureuse.',
        location: 'Salle Olympia, Paris'
    },
    {
        title: 'Showcase Privé',
        image: '/src/assets/img/pictures-section/sample.png',
        date: '21/03/2025',
        description: 'Un showcase exclusif pour les fans les plus fidèles. Une performance unique et des moments privilégiés avec le groupe.',
        location: 'Studio Secret, Lyon'
    },
    {
        title: 'Festival Rock',
        image: '/src/assets/img/pictures-section/sample.png',
        date: '22/03/2025',
        description: 'Lava Bow en tête d\'affiche du plus grand festival rock de l\'été. Une performance énergique devant des milliers de fans.',
        location: 'Parc des Expositions, Marseille'
    },
    {
        title: 'Acoustic Session',
        image: '/src/assets/img/pictures-section/sample.png',
        date: '23/03/2025',
        description: 'Une version acoustique et épurée des plus grands succès du groupe. Une expérience musicale intime et authentique.',
        location: 'Café de la Musique, Bordeaux'
    },
    {
        title: 'World Tour Finale',
        image: '/src/assets/img/pictures-section/sample.png',
        date: '24/03/2025',
        description: 'La grande finale de la tournée mondiale. Un spectacle grandiose qui marquera l\'histoire du groupe et de ses fans.',
        location: 'Stade de France, Paris'
    },
]

export default function Pictures() {
    const [positions, setPositions] = useState([])

    // Generate random positions for each picture without overlaps
    useEffect(() => {
        const generateRandomPositions = () => {
            const containerWidth = 1400 // Approximate container width
            const containerHeight = 800 // Approximate container height
            const frameWidth = 290 // PicFrame width + padding
            const frameHeight = 350 // PicFrame height + padding
            const minDistance = 20 // Minimum distance between frames

            const newPositions = []
            const maxAttempts = 100 // Maximum attempts per position to avoid infinite loops

            // Function to check if two rectangles overlap
            const isOverlapping = (pos1, pos2) => {
                return !(pos1.x + frameWidth + minDistance < pos2.x ||
                    pos2.x + frameWidth + minDistance < pos1.x ||
                    pos1.y + frameHeight + minDistance < pos2.y ||
                    pos2.y + frameHeight + minDistance < pos1.y)
            }

            // Generate position for each picture
            for (let i = 0; i < event.length; i++) {
                let validPosition = null
                let attempts = 0

                while (!validPosition && attempts < maxAttempts) {
                    const maxX = Math.max(0, containerWidth - frameWidth)
                    const maxY = Math.max(0, containerHeight - frameHeight)

                    const candidatePosition = {
                        x: Math.random() * maxX,
                        y: Math.random() * maxY,
                        rotation: (Math.random() - 0.5) * 20 // Random rotation between -10 and 10 degrees
                    }

                    // Check if this position overlaps with any existing position
                    const hasOverlap = newPositions.some(existingPos =>
                        isOverlapping(candidatePosition, existingPos)
                    )

                    if (!hasOverlap) {
                        validPosition = candidatePosition
                    }

                    attempts++
                }

                // If we couldn't find a valid position after max attempts,
                // place it in a fallback grid position
                if (!validPosition) {
                    const fallbackX = (i % 3) * (frameWidth + minDistance)
                    const fallbackY = Math.floor(i / 3) * (frameHeight + minDistance)

                    validPosition = {
                        x: Math.min(fallbackX, containerWidth - frameWidth),
                        y: Math.min(fallbackY, containerHeight - frameHeight),
                        rotation: (Math.random() - 0.5) * 20
                    }
                }

                newPositions.push(validPosition)
            }

            setPositions(newPositions)
        }

        generateRandomPositions()
    }, [])

    return (
        <Section id="pictures">
            <LavaTypo variant="h1">Lava Bow en photos</LavaTypo>
            <Box
                position="relative"
                width="100%"
                height="800px"
                overflow="hidden"
                mt={8}
                padding={4}
            >
                {event.map((e, index) => (
                    <Box
                        key={index}
                        position="absolute"
                        left={positions[index]?.x || 0}
                        top={positions[index]?.y || 0}
                        transform={`rotate(${positions[index]?.rotation || 0}deg)`}
                        transition="all 0.3s ease"
                        zIndex={9999 + index}
                        overflow={'visible'}
                    >
                        <PicFrame event={e} />
                    </Box>
                ))}
            </Box>
        </Section>
    )
}
