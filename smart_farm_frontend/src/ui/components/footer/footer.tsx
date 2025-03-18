import React from 'react';
import { Flex, Image, Text, useMantineColorScheme } from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
    const githubLink = "https://github.com/ETCE-LAB";
    const ETCELink = "https://etce-lab.com/";
    const navigate = useNavigate();

    // Get the current color scheme (dark or light)
    const { colorScheme } = useMantineColorScheme();

    return (
        <Flex
            justify="space-between"
            align="center"
            style={{
                height: "50px",
                padding: '0 20px',
                backgroundColor: "transparent",
            }}
        >
            <Text
                style={{
                    cursor: "pointer",
                    color: colorScheme === 'dark' ? '#E0E0E0' : '#4F4F4F',
                }}
                onClick={() => navigate('/legal-notice')}
            >
                Impress | Legal Notice | Privacy Policy
            </Text>

            <Flex style={{ alignItems: 'center' }}>
                <IconBrandGithub
                    size={24}
                    onClick={() => window.open(githubLink, "_blank")}
                    style={{
                        cursor: 'pointer',
                        color: '#199ff4',
                        marginLeft: 10,
                    }}
                />

                <Image
                    src="./assets/icons/ETCE.png"
                    alt="ETCE Logo"
                    style={{
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        marginLeft: 10,
                    }}
                    onClick={() => window.open(ETCELink, "_blank")}
                />
            </Flex>
        </Flex>
    );
};

export default Footer;
