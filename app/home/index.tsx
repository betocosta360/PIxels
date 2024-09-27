import { View, Text, Pressable, StyleSheet, ScrollView, TextInput, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons'
import { theme } from '@/constants/theme'
import { hp, wp } from '@/helpers/common'
import Categories from '@/components/categories'
import { apiCall } from '@/api'
import ImageGrid from '@/components/imageGrid'
import { debounce } from 'lodash';
import FiltersModal from '@/components/filtersModal'
import bottomSheetModalRef from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router'

var page = 1

export default function Home() {
    const { top } = useSafeAreaInsets()
    const paddingTop = top > 0 ? top + 10 : 30
    const [search, setSearch] = useState('')
    const [images, setImages] = useState([])
    const [filters, setFilters] = useState(null)
    const [activeCategory, setActiveCategory] = useState(null)
    const searchInputRef = useRef(null)
    const modalRef = useRef(null)
    const scrollRef = useRef(null)
    const router = useRouter()
    const [isEndReached, setIsEndReached] = useState(false)

    useEffect(() => {
        fetchImages()
    }, [])

    const fetchImages = async (params = { page: 1 }, append = true) => {
        console.log('params', params, append)

        let res = await apiCall(params)
        if (res.success && res?.data?.hits) {
            if (append) {
                setImages([...images, ...res.data.hits]) // Corrigido: spread operator correto
            } else {
                setImages([...res.data.hits])
            }
        }
    }

    const openFiltersModal = () => {
        modalRef?.current?.present();
    }

    const closeFiltersModal = () => {
        modalRef?.current?.close();
    }

    const applyFliters = () => {
        if (filters) {
            page = 1,
                setImages([])
            let params = {
                page,
                ...filters,
            }
            if (activeCategory) params.category = activeCategory;
            if (search) params.q = search;
            fetchImages(params, false)
        }
        closeFiltersModal()
    }

    const resetFilters = () => {
        if (filters) {
            page = 1,
                setFilters(null)
            setImages([])
            let params = {
                page,

            }
            if (activeCategory) params.category = activeCategory;
            if (search) params.q = search;
            fetchImages(params, false)
        }
        closeFiltersModal()
    }

    const clearThisFilter = (filterName) => {
        let filterz = { ...filters }
        delete filterz[filterName]
        setFilters({ ...filterz })
        page: 1
        setImages([])
        let params = {
            page,
            ...filterz,
        }
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params, false)
    }

    const handleChangeCategory = (cat) => {
        setActiveCategory(cat)
        clearSearch()
        setImages([])
        page = 1
        let params = {
            page,
            ...filters,
        }
        if (cat) params.category = cat;
        fetchImages(params, false)
    }

    const handleSearch = (text) => {
        setSearch(text)
        if (text.length > 2) {
            page = 1
            setImages([])
            setActiveCategory(null)
            fetchImages({ page, q: text, ...filters }, false)
        }
        if (text == "") {
            page = 1
            searchInputRef?.current?.clear()
            setImages([])
            setActiveCategory(null)
            fetchImages({ page, ...filters }, false)
        }
    }

    const clearSearch = () => {
        setSearch("")
        setImages([])
        page = 1
        fetchImages({ page })
        searchInputRef?.current?.clear()
    }
    const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

    console.log('filters', filters)


    const handleScroll = (event) => {
        const contentHeight = event.nativeEvent.contentSize.height
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height
        const scrollOffset = event.nativeEvent.contentOffset.y
        const bottomPosition = contentHeight - scrollViewHeight

        if(scrollOffset>=bottomPosition-1){
            if(!isEndReached)(true)
                ++page
            let params ={
                page,
                ...filters
            }
            if(activeCategory)params.category = activeCategory
            if(search) params.q = search
            fetchImages(params)
        } else if(isEndReached){
            setIsEndReached(false)
        }
    }

    const handleScrollUp = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ y: 0, animated: true });  // Rolagem suave para o topo
        }
    }

    return (
        <View style={[styles.container, { paddingTop }]}>
            <View style={styles.header}>
                <Pressable onPress={handleScrollUp} >
                    <Text style={styles.title}>Pixels</Text>
                </Pressable>
                <Pressable onPress={openFiltersModal}>
                    <FontAwesome6 name='bars-staggered' size={22} color={theme.colors.neutral(0.7)} />
                </Pressable>
            </View>
            <ScrollView
                ref={scrollRef}
                onScroll={handleScroll}
                scrollEventThrottle={5}
                contentContainerStyle={{ gap: 15 }}>
                <View style={styles.searchBar}>
                    <View style={styles.searchIcon}>
                        <Feather name='search' size={24} color={theme.colors.neutral(0.7)} />
                    </View>
                    <TextInput
                        placeholder='Pesquise....'
                        //value={search}
                        ref={searchInputRef}
                        onChangeText={handleTextDebounce}
                        style={styles.searchInput}
                    />

                    {
                        search && (
                            <Pressable onPress={() => handleSearch("")} style={styles.closeIcon}>
                                <Ionicons name='close' size={24} color={theme.colors.neutral(0.6)} />
                            </Pressable>
                        )
                    }
                </View>
                <View style={styles.categories}>
                    <Categories activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />
                </View>

                {
                    filters && (
                        <View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
                                {
                                    Object.keys(filters).map((key, index) => {
                                        return (
                                            <View key={key} style={styles.filterItem}>

                                                {
                                                    key == 'colors' ? (
                                                        <View
                                                            style={{
                                                                height: 20,
                                                                width: 30,
                                                                borderRadius: 10,
                                                                backgroundColor: filters[key]
                                                            }}
                                                        />
                                                    ) : (
                                                        <Text style={styles.filterItemText}>{filters[key]}</Text>
                                                    )
                                                }



                                                <Pressable style={styles.filterCloseIcon}
                                                    onPress={() => clearThisFilter(key)}>
                                                    <Ionicons name='close' size={14} color={theme.colors.neutral(0.9)} />
                                                </Pressable>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    )
                }

                <View>
                    {images.length > 0 && <ImageGrid images={images} router={router} />}
                </View>
                <View style={{ marginBottom: 75, marginTop: images.length > 0 ? 10 : 70 }}>
                    <ActivityIndicator size="large" />
                </View>
            </ScrollView>
            <FiltersModal
                modalRef={modalRef}
                filters={filters}
                setFilters={setFilters}
                onClose={closeFiltersModal}
                onApply={applyFliters}
                onReset={resetFilters} />
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        gap: 15
    },
    header: {
        marginHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        paddingVertical: 10
    },
    title: {
        fontSize: hp(3),
        fontWeight: theme.fontWeights.semiBold,
        color: theme.colors.neutral(0.9)
    },
    searchBar: {
        marginHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        borderWidth: 1,
        padding: 6,
        borderColor: theme.colors.grayBG,
        backgroundColor: theme.colors.white,
        borderRadius: theme.radius.lg
    },
    searchIcon: {
        padding: 8,
    },
    searchInput: {
        flex: 1,
        borderRadius: theme.radius.sm,
        paddingVertical: 10,
        fontSize: hp(1.8),
    },
    closeIcon: {
        padding: 4,
        backgroundColor: theme.colors.neutral(0.1),
        borderRadius: theme.radius.sm
    },
    filters: {
        paddingHorizontal: wp(4),
        gap: 10
    },
    filterItem: {
        backgroundColor: theme.colors.grayBG,
        padding: 3,
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: theme.radius.xs,
        gap: 10,
        paddingHorizontal: 10
    },
    filterItemText: {
        fontSize: hp(1.9),
        //color: theme.colors.neutral(0.9)
    },
    filterCloseIcon: {
        padding: 4,
        backgroundColor: theme.colors.neutral(0.2),
        borderRadius: 7
    }

})
