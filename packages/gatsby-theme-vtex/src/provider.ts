import { jsx, ThemeProvider } from '@theme-ui/core'
import { WrapRootElementBrowserArgs } from 'gatsby'

// import theme from '@vtex/gatsby-plugin-theme-ui/src/index'

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) =>
  jsx(
    ThemeProvider,
    {
      theme: () => theme,
    },
    element
  )

const theme = {
    space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
    fonts: {
        body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        heading: "inherit",
        monospace: "Menlo, monospace"
    },
    fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
    fontWeights: {
        body: 400,
        heading: 700,
        bold: 700
    },
    lineHeights: {
        body: 1.5,
        heading: 1.125
    },
    colors: {
        text: "#3f3f40",
        background: "#fff",
        primary: "#00397b",
        secondary: "#F6B428",
        muted: "#f0f0f0",
        textMuted: "#979899",
        textBold: "#03003d",
        gray: "#e3e4e6"
    },
    styles: {
        root: {
            fontFamily: "body",
            lineHeight: "body",
            fontWeight: "body"
        },
        h1: {
            color: "text",
            fontFamily: "heading",
            lineHeight: "heading",
            fontWeight: "heading",
            fontSize: 5
        },
        h2: {
            color: "text",
            fontFamily: "heading",
            lineHeight: "heading",
            fontWeight: "heading",
            fontSize: 4
        },
        h3: {
            color: "text",
            fontFamily: "heading",
            lineHeight: "heading",
            fontWeight: "heading",
            fontSize: 3
        },
        h4: {
            color: "text",
            fontFamily: "heading",
            lineHeight: "heading",
            fontWeight: "heading",
            fontSize: 2
        },
        h5: {
            color: "text",
            fontFamily: "heading",
            lineHeight: "heading",
            fontWeight: "heading",
            fontSize: 1
        },
        h6: {
            color: "text",
            fontFamily: "heading",
            lineHeight: "heading",
            fontWeight: "heading",
            fontSize: 0
        },
        p: {
            color: "text",
            fontFamily: "body",
            fontWeight: "body",
            lineHeight: "body"
        },
        a: {
            color: "primary"
        },
        pre: {
            fontFamily: "monospace",
            overflowX: "auto",
            code: {
                color: "inherit"
            }
        },
        code: {
            fontFamily: "monospace",
            fontSize: "inherit"
        },
        table: {
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0
        },
        th: {
            textAlign: "left",
            borderBottomStyle: "solid"
        },
        td: {
            textAlign: "left",
            borderBottomStyle: "solid"
        },
        img: {
            maxWidth: "100%"
        }
    },
    useCustomProperties: !1,
    initialColorModeName: !1,
    initialColorMode: !1,
    useLocalStorage: !1,
    sizes: {
        container: "80em"
    },
    layout: {
        container: {
            px: [0, 2, 3]
        }
    },
    breakpoint: ["80em", "56em", "container"],
    header: {
        bg: "background",
        px: 0,
        py: 0,
        justifyContent: ["center", "space-between", "space-between"],
        alignItems: "center",
        flexWrap: "wrap",
        overmenu: {
            display: ["none", "none", "flex"],
            alignItems: "center",
            justifyContent: "space-between",
            textDecoration: "none",
            bg: "#02003d",
            minHeight: "48px",
            color: "muted",
            fontSize: 1,
            px: [1, 2, 3],
            a: {
                mx: "24px",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                color: "inherit",
                "&.first": {
                    marginLeft: 0
                },
                "&.last": {
                    marginRight: 0
                },
                "&.active": {
                    color: "textMuted"
                },
                "&:hover": {
                    color: "textMuted"
                }
            }
        },
        menu: {
            marginLeft: [0, 0, 4],
            my: [3, 0, 0],
            a: {
                textDecoration: "none",
                color: "background",
                mx: 4,
                "&.active": {
                    color: "secondary"
                },
                "&:hover": {
                    color: "muted"
                },
                display: "flex",
                fontSize: "13px",
                alignItems: "center",
                textTransform: "uppercase",
                height: "45px"
            },
            display: ["none", "flex", "flex"],
            margin: [0, 0, 0],
            bg: "primary",
            borderBottomColor: "secondary",
            borderBottomWidth: "2px",
            borderBottomStyle: "solid"
        },
        notificationbar: {
            display: ["none", "none", "flex"],
            alignItems: "center",
            textDecoration: "underline",
            justifyContent: "center",
            bg: "#e0efe0",
            color: "textBold",
            minHeight: "48px",
            fontWeight: "bold",
            fontSize: 0
        },
        search: {
            maxWidth: "100%",
            bg: "background",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "gray",
            px: 3,
            container: {
                display: ["none", "flex", "flex"],
                flex: 1,
                ml: 5,
                mr: 0
            }
        },
        left: {
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap"
        },
        right: {
            alignItems: "center"
        },
        width: "100%",
        height: ["56px"],
        signin: {
            display: ["none", "flex", "flex"],
            bg: "background",
            color: "primary",
            mx: 4
        }
    },
    minicart: {
        bg: "secondary",
        position: "relative",
        marginLeft: 0,
        cursor: "pointer",
        badge: {
            bg: "#C00",
            borderRadius: "0 0 0 2px",
            height: "auto",
            position: "absolute",
            width: "auto",
            top: 0,
            right: 0,
            fontSize: "11px",
            textAlign: "center",
            color: "#FFF",
            padding: "2px 3px 3px 4px"
        },
        drawer: {
            container: {
                display: "flex",
                bg: "background",
                height: "100%",
                flexDirection: "column",
                overflow: "hidden"
            },
            header: {
                p: 3,
                title: {
                    pt: 3
                }
            },
            content: {
                flexDirection: "column",
                flex: 1,
                overflow: "auto",
                px: 3,
                product: {
                    py: 3,
                    borderBottomWidth: 1,
                    borderBottomStyle: "solid",
                    borderBottomColor: "muted",
                    "&:last-child": {
                        borderWidth: 0
                    },
                    image: {
                        height: 96,
                        width: 96
                    },
                    name: {
                        flexDirection: "column",
                        ml: 3,
                        value: {
                            mt: 3
                        }
                    }
                }
            },
            footer: {
                p: 3,
                flexDirection: "column",
                boxShadow: "0 0 12px rgba(0,0,0,.15)",
                subtotal: {
                    justifyContent: "space-between"
                },
                total: {
                    justifyContent: "space-between",
                    text: {
                        fontSize: 4
                    },
                    value: {
                        fontSize: 4
                    }
                },
                message: {
                    my: 3
                }
            }
        },
        display: ["none", "inline-block", "inline-block"],
        height: [56],
        width: [72],
        borderRadius: 0,
        borderBottom: "3px solid #CD8D06",
        borderRight: "1px solid #E6A316",
        boxSizing: "border-box"
    },
    footer: {
        newsletter: {
            bg: "#fafafa",
            p: 4,
            mb: 4,
            flexWrap: "wrap",
            alignItems: "center",
            formTitle: {
                flexDirection: "column",
                mr: [0, 4],
                alignItems: ["center", "start"],
                title: {
                    color: "#06387a",
                    fontSize: "13px",
                    letterSpacing: "5px",
                    textTransform: "uppercase",
                    mb: 1
                },
                subtitle: {
                    fontSize: "16px",
                    maxWidth: 300,
                    fontWeight: "bold",
                    textAlign: ["center", "left"],
                    textTransform: "uppercase",
                    margin: 0,
                    letterSpacing: "6px",
                    lineHeight: "1.2"
                }
            },
            form: {
                flexDirection: ["column", "row"],
                flex: 1,
                mt: [4, 0],
                label: {
                    width: ["100%", "33%"],
                    mr: [0, 3],
                    mb: [3, 0]
                },
                input: {
                    bg: "#e8e8e8",
                    border: 0,
                    borderRadius: 0,
                    padding: "5px 10px",
                    height: 40
                },
                button: {
                    mt: [0, "24px"],
                    bg: "primary",
                    borderRadius: 0,
                    height: 40,
                    width: ["100%", "33%"],
                    fontSize: 14,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase"
                }
            }
        },
        menu: {
            flexDirection: ["column", "row"],
            alignItems: ["center", "start"],
            px: 3,
            section: {
                flexDirection: "column",
                flex: 1,
                mb: [2, 0],
                width: "100%",
                borderBottom: ["1px solid #e6e6e6", 0],
                title: {
                    mb: "10px",
                    color: "primary",
                    textTransform: "uppercase",
                    fontSize: "14px",
                    textAlign: ["center", "left"],
                    fontWeight: 600,
                    letterSpacing: "1px"
                },
                node: {
                    justifyContent: ["center", "left"]
                },
                list: {
                    p: 0,
                    flexDirection: "column",
                    li: {
                        color: "#656565",
                        fontSize: "14px",
                        lineHeight: "22px",
                        mb: 3,
                        justifyContent: ["center", "left"],
                        a: {
                            color: "#656565",
                            textDecoration: "none",
                            "&:hover": {
                                color: "secondary"
                            }
                        }
                    }
                }
            }
        },
        institutional: {
            flexDirection: "column",
            alignItems: "center",
            color: "#656565",
            fontSize: "12px",
            lineHeight: "22px",
            px: 3,
            py: 4,
            textAlign: "center",
            a: {
                color: "primary",
                textDecoration: "none",
                mb: 2,
                "&:hover": {
                    textDecoration: "underline"
                }
            }
        },
        paymentSecurity: {
            bg: "#f2f2f2",
            justifyItems: "center",
            px: 3,
            py: 4,
            flexDirection: ["column", "row"],
            section: {
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
                title: {
                    mb: 2
                },
                cardList: {
                    p: 0,
                    flexWrap: "wrap",
                    justifyContent: "center",
                    mb: [4, 0],
                    li: {
                        height: "26px",
                        width: "42px",
                        display: "inline-block",
                        font: "0/0 serif",
                        textShadow: "none",
                        color: "transparent",
                        mx: 1,
                        my: [1, 0],
                        borderRadius: 4,
                        backgroundSize: "cover"
                    },
                    "& .visa": {
                        backgroundImage: "url(https://marinbrasil.vtexassets.com/assets/faststore/images/visa___0a66c88b8bb3f5f7eaf97c668bc3418a.png)"
                    },
                    "& .amex": {
                        backgroundImage: "url(https://marinbrasil.vtexassets.com/assets/faststore/images/amex___b4c027829ff723bee67d6adbaab0e305.png)"
                    },
                    "& .elo": {
                        backgroundImage: "url(https://marinbrasil.vtexassets.com/assets/faststore/images/elo___dbb13722634566cc06c08962d2abfe79.png)"
                    },
                    "& .mastercard": {
                        backgroundImage: "url(https://marinbrasil.vtexassets.com/assets/faststore/images/mastercard___6f96c15de045a42d6aa41f5f2f1701c8.png)"
                    },
                    "& .diners-club": {
                        backgroundImage: "url(https://marinbrasil.vtexassets.com/assets/faststore/images/dinners___84f7d00ab00137631fa68ba1f93d0aa8.png)"
                    },
                    "& .aura": {
                        backgroundImage: "url(https://marinbrasil.vtexassets.com/assets/faststore/images/aura___32cc316792fd395da888bca07e1dd7e0.png)"
                    },
                    "& .hipercard": {
                        backgroundImage: "url(https://marinbrasil.vtexassets.com/assets/faststore/images/hipercard___ff78a5def5ad1d1c164ae33d7fce0235.png)"
                    },
                    "& .boleto": {
                        backgroundImage: "url(https://marinbrasil.vtexassets.com/assets/faststore/images/boleto___1e421da042460e56e02261df37114a69.png)"
                    },
                    "& .maestro": {
                        backgroundImage: "url(https://marinbrasil.vtexassets.com/assets/faststore/images/maestro___450117396acca72540c845a4cd3b7672.png)"
                    },
                    "& .visa-electron": {
                        backgroundImage: "url(https://marinbrasil.vtexassets.com/assets/faststore/images/visaelectron___7f579fb4603be9cec7d9027e0edf36f3.png)"
                    }
                }
            }
        }
    },
    card: {
        margin: "0 auto",
        width: "100%",
        maxWidth: ["100%", "100%", "96rem"],
        maxHeight: "540px",
        bg: "#e0efe0",
        flexWrap: "wrap",
        image: {
            width: ["100%", "70%"],
            display: "inline",
            maxHeight: "540px",
            objectFit: "cover",
            link: {
                flex: 1
            },
            content: {
                width: "100%"
            }
        },
        info: {
            padding: [3, 0, 0],
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: ["100%", "30%"],
            action: {
                marginTop: 3
            }
        }
    },
    "rich-text": {
        default: {
            color: "textBold",
            fontSize: 2,
            fontWeight: "bold",
            textAlign: "center",
            textTransform: "uppercase"
        },
        question: {
            color: "textBold",
            fontSize: 5,
            fontWeight: "bold",
            textAlign: "center"
        },
        link: {
            color: "textBold",
            fontSize: 4,
            textAlign: "center",
            textTransform: "uppercase",
            textDecoration: "none"
        }
    },
    buttons: {
        loadMore: {
            width: "100%",
            cursor: "pointer",
            "&:disabled": {
                cursor: "default",
                background: "#fff",
                color: "text"
            }
        }
    },
    shelfTitle: {
        fontSize: "2.25rem",
        fontWeight: 200,
        color: "#727273"
    },
    summary: {
        offer: {
            mb: "32px"
        },
        name: {
            fontWeight: 600,
            fontSize: "18px",
            color: "#2e2e2e",
            marginTop: "1rem",
            marginBottom: "3rem"
        },
        listPrice: {
            textDecoration: "line-through",
            fontSize: ".875rem",
            minHeight: "21px",
            color: "#727273"
        },
        price: {
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#2e2e2e"
        },
        discountBadge: {
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#fff",
            backgroundColor: "#077b0b",
            borderRadius: "1000px",
            alignItems: "center",
            paddingLeft: "0.5rem",
            paddingRight: "0.5rem",
            marginLeft: "0.5rem",
            minWidth: "51px"
        },
        availability: {
            fontSize: "0.875",
            marginBottom: "0.5rem",
            color: "#727273"
        }
    },
    detail: {
        offer: {
            mb: "32px"
        },
        name: {
            fontWeight: 600,
            fontSize: "18px",
            color: "#2e2e2e",
            marginTop: "1rem",
            marginBottom: "3rem"
        },
        listPrice: {
            textDecoration: "line-through",
            fontSize: ".875rem",
            minHeight: "21px",
            color: "#727273"
        },
        price: {
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#2e2e2e"
        },
        discountBadge: {
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#fff",
            backgroundColor: "#077b0b",
            borderRadius: "1000px",
            alignItems: "center",
            paddingLeft: "0.5rem",
            paddingRight: "0.5rem",
            marginLeft: "0.5rem",
            minWidth: "51px"
        },
        availability: {
            fontSize: "0.875",
            marginBottom: "0.5rem",
            color: "#727273"
        }
    },
    productTitle: {
        mb: 4
    }
}
