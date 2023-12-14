"use client";
import {
    ERC20DepositForm,
    EtherDepositForm,
} from "@cartesi/rollups-explorer-ui";
import {
    AppShell,
    Burger,
    Button,
    Group,
    Modal,
    NavLink,
    Stack,
    Switch,
    useMantineColorScheme,
    useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { FC, ReactNode } from "react";
import {
    TbApps,
    TbDotsVertical,
    TbHome,
    TbMoneybag,
    TbMoonStars,
    TbPigMoney,
    TbSun,
} from "react-icons/tb";
import { useAccount, useNetwork } from "wagmi";
import CartesiLogo from "./cartesiLogo";
import ConnectionView from "./connectionView";
import { useApplicationsQuery, useTokensQuery } from "../graphql";
import Footer from "./footer";

const Shell: FC<{ children: ReactNode }> = ({ children }) => {
    const [opened, { toggle }] = useDisclosure();
    const [menuOpened, { toggle: toggleMenu }] = useDisclosure(false);
    const [deposit, { open: openDeposit, close: closeDeposit }] =
        useDisclosure(false);
    const [navDepositOpened, { toggle: toggleNavDeposit }] =
        useDisclosure(false);
    const [etherDeposit, { open: openEtherDeposit, close: closeEtherDeposit }] =
        useDisclosure(false);
    const theme = useMantineTheme();
    const isSmallDevice = useMediaQuery(`(max-width:${theme.breakpoints.sm})`);
    const { isConnected } = useAccount();
    const { chain } = useNetwork();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const [{ data: applicationData }] = useApplicationsQuery({
        variables: {
            limit: 1000,
        },
    });
    const applications = (applicationData?.applications ?? []).map((a) => a.id);
    const [{ data: tokenData }] = useTokensQuery({
        variables: {
            limit: 1000,
        },
    });
    const tokens = (tokenData?.tokens ?? []).map(
        (a) => `${a.symbol} - ${a.name} - ${a.id}`,
    );

    const themeDefaultProps = theme.components?.AppShell?.defaultProps ?? {};

    return (
        <AppShell
            header={themeDefaultProps.header}
            navbar={{
                ...themeDefaultProps?.navbar,
                width: 180,
                collapsed: {
                    mobile: !opened,
                },
            }}
            aside={{
                ...themeDefaultProps?.aside,
                collapsed: {
                    desktop: !menuOpened,
                    mobile: !menuOpened,
                },
            }}
            padding="md"
        >
            <Modal opened={deposit} onClose={closeDeposit} title="Deposit">
                <ERC20DepositForm applications={applications} tokens={tokens} />
            </Modal>
            <Modal
                opened={etherDeposit}
                onClose={closeEtherDeposit}
                title="Deposit Ether"
            >
                <EtherDepositForm applications={applications} />
            </Modal>
            <AppShell.Header data-testid="header">
                <Group h="100%" px="md">
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="sm"
                    />
                    <Group justify="space-between" style={{ flex: 1 }}>
                        <Link href="/">
                            <CartesiLogo height={40} />
                        </Link>
                        <Group ml="xl" gap="md">
                            <Button
                                variant="subtle"
                                leftSection={<TbPigMoney />}
                                onClick={openDeposit}
                                disabled={!isConnected}
                                visibleFrom="sm"
                                data-testid="deposit-button"
                            >
                                Deposit
                            </Button>
                            <Button
                                variant="subtle"
                                leftSection={<TbPigMoney />}
                                onClick={openEtherDeposit}
                                disabled={!isConnected}
                                visibleFrom="sm"
                                data-testid="deposit-ether-button"
                            >
                                Deposit Ether
                            </Button>
                            {!isSmallDevice && <ConnectButton />}
                            <Switch
                                checked={colorScheme === "dark"}
                                onChange={() => toggleColorScheme()}
                                size="md"
                                onLabel={
                                    <TbSun color={theme.white} size="1rem" />
                                }
                                offLabel={
                                    <TbMoonStars
                                        color={theme.colors.gray[6]}
                                        size="1rem"
                                    />
                                }
                            />
                        </Group>
                    </Group>
                    <Button variant="subtle" onClick={toggleMenu}>
                        <TbDotsVertical size={theme.other.iconSize} />
                    </Button>
                </Group>
            </AppShell.Header>
            <AppShell.Aside p="md">
                <ConnectionView />
            </AppShell.Aside>
            <AppShell.Navbar py="md" px={4} data-testid="navbar">
                <Stack px={13}>
                    <NavLink
                        label="Home"
                        href="/"
                        leftSection={<TbHome />}
                        data-testid="home-link"
                    />

                    <NavLink
                        label="Applications"
                        href="/applications"
                        leftSection={<TbApps />}
                        data-testid="applications-link"
                    />

                    <NavLink
                        label="Deposit"
                        leftSection={<TbMoneybag />}
                        disabled={!isConnected}
                        opened={isConnected && navDepositOpened}
                        onClick={toggleNavDeposit}
                        hiddenFrom="sm"
                    >
                        <NavLink
                            active={isConnected}
                            label="ERC-20"
                            variant="subtle"
                            component="button"
                            onClick={openDeposit}
                            leftSection={<TbPigMoney />}
                            hiddenFrom="sm"
                        />
                        <NavLink
                            active={isConnected}
                            variant="subtle"
                            component="button"
                            label={chain?.nativeCurrency.name ?? "Ether"}
                            onClick={openEtherDeposit}
                            leftSection={<TbPigMoney />}
                            hiddenFrom="sm"
                        />
                    </NavLink>

                    {isSmallDevice && <ConnectButton showBalance />}
                </Stack>
            </AppShell.Navbar>
            <AppShell.Main>{children}</AppShell.Main>
            <Footer />
        </AppShell>
    );
};
export default Shell;