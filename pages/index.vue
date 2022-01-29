<template>
    <div class="fintual-real-assets">
        <div class="fintual-real-assets__header">
            <input v-model="initDate" type="date" :max="maxDate" />
            <input v-model="endDate" type="date" :min="minDate" :max="maxDate" />
            <button @click="refresh">Refresh</button>
        </div>
        <h4 v-if="realAssets.length > 1">Rendimiento anualizado: {{ annualReturn }}%</h4>
        <ul class="fintual-real-assets__content" v-for="(value, index) in realAssets" :key="value.id">
            <li>
                <strong>Acción al {{ formartDate(value.attributes.date) }}:</strong> {{ formatPrice(value.attributes.price) }} CLP
            </li>
        </ul>
    </div>
</template>

<script>
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const date = format(new Date(new Date().toISOString().slice(0, -1)), 'yyyy-MM-dd')

export default {
    data() {
        return {
            annualReturn: 0,
            endDate: date,
            initDate: date,
            realAssets: []
        }
    },

    watch: {
        initDate(date) {
            this.initDate = date
            this.$fetch()
        },

        endDate(date) {
            this.endDate = date
            this.$fetch()
        }
    },

    computed: {
        maxDate() {
            return date
        },
        minDate() {
            if (this.initDate <= this.endDate) return this.initDate
        }
    },

    async fetch() {
        const realAssets = await this.$axios.$get(
            `https://fintual.cl/api/real_assets/188/days?from_date=${this.initDate}&to_date=${this.endDate}`
        )

        const annual = realAssets.data.map((annual) => {
            return annual.attributes.price
        })
        const annualReturn = ((annual.shift() / annual.slice(-1)[0]) ** (1 / 12) - 1) * 100
        const symbol = this.validateAnnualReturn(annualReturn.toFixed(2)) ? '+' : ''
        this.annualReturn = `${symbol}${annualReturn.toFixed(2)}`
        this.realAssets = realAssets.data
    },

    methods: {
        refresh() {
            this.$fetch()
        },

        validateAnnualReturn(numb) {
            return !isNaN(numb) && Number(numb) > 0
        },

        formartDate(date) {
            return format(new Date(date), 'dd LLL yyyy', { locale: es })
        },

        formatPrice(price) {
            const locale = 'es-CL'
            const currency = 'CLP'
            const formatter = new Intl.NumberFormat(locale, {
                currencyDisplay: 'symbol',
                style: 'currency',
                currency,
                minimumFractionDigits: 2
            })
            return formatter.format(price)
        }
    }
}
</script>

<style lang="scss">
.fintual-real-assets {
    padding: 30px;
    font-family: 'Open Sans', 'Helvetica Neue', sans-serif;

    &__content {
        padding: 0;
        list-style: none;

        li {
            background-color: #f4f4f4;
            border-radius: 4px;
            margin-bottom: 10px;
            padding: 10px;
            text-transform: uppercase;
        }
    }
}
</style>
