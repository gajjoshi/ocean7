from .models import MobileData
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import random
from django.http import JsonResponse
from .data.cards import cards

@csrf_exempt
def receive_data(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            key = data.get('key')
            mobile_data = data.get('data')

            # Save data to the database
            MobileData.objects.create(key=key, data=mobile_data)

            return JsonResponse({'status': 'success', 'message': 'Data received and saved!'})
        
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON format'}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Only POST requests are allowed'}, status=405)


def get_data(request):
    if request.method == 'GET':
        data = MobileData.objects.all().values()
        return JsonResponse(list(data), safe=False)
    return JsonResponse({'status': 'error', 'message': 'Only GET requests are allowed'}, status=405)



# Global variable for card state (or store this in a database)
cardState = {
    'revealedCardIds': [],
    'currentIndex': [0, 0, 0],  # For sections 0, 1, 2
    'assignedCardIndices': [[], [], []],
    'displayedCards': [[], [], []],
    'jokerCard': None
}


@csrf_exempt  # Disable CSRF protection for this view
def assign_card_to_section(request, section_id):
    try:
        section_id = int(section_id)  # Ensure section_id is an integer
        if section_id < 0 or section_id > 2:
            return JsonResponse({"error": "Invalid section ID"}, status=400)

        # Check if all cards have been revealed for the section
        if len(cardState['assignedCardIndices'][section_id]) >= len(cards):
            return JsonResponse({"error": "All cards assigned in this section"}, status=400)

        # Get available cards that have not been revealed
        available_cards = [card for card in cards if card['id'] not in cardState['revealedCardIds']]

        if not available_cards:
            return JsonResponse({"error": "No cards left to assign"}, status=400)

        # Randomly select a card
        selected_card = random.choice(available_cards)
        
        # Update the cardState
        cardState['revealedCardIds'].append(selected_card['id'])
        cardState['assignedCardIndices'][section_id].append(selected_card['id'])
        cardState['displayedCards'][section_id].append(selected_card)

        return JsonResponse({
            "success": True,
            "card": selected_card,
            "section_id": section_id
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt  # Disable CSRF protection for this view
def reveal_joker_card(request):
    try:
        # Check if jokerCard is already revealed
        if cardState['jokerCard'] is not None:
            return JsonResponse({"error": "Joker card has already been revealed"}, status=400)


        available_cards = [card for card in cards if card['id'] not in cardState['revealedCardIds']]

       
        # Randomly select a card
        selected_card = random.choice(available_cards)
        

        if not selected_card:
            return JsonResponse({"error": "No joker cards left to assign"}, status=400)

        
        # Update the cardState
        cardState['revealedCardIds'].append(selected_card['id'])
        cardState['jokerCard'] = selected_card

        return JsonResponse({
            "success": True,
            "jokerCard": selected_card
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt  # Disable CSRF protection for this view
def reset_card_state(request):
    if request.method == 'POST':
        try:
            global cardState
            # Clear the current state values
            cardState['revealedCardIds'] = []
            cardState['currentIndex'] = [0, 0, 0]
            cardState['assignedCardIndices'] = [[], [], []]
            cardState['displayedCards'] = [[], [], []]
            cardState['jokerCard'] = None

            return JsonResponse({
                'status': 'success',
                'message': 'Card state has been reset!',
                'cardState': cardState  # Return the cleared state
            })

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Only POST requests are allowed'}, status=405)

@csrf_exempt  # Disable CSRF protection for this view
def update_card_state(request):
    if request.method == 'POST':
        try:
            # Simply return the current cardState
            return JsonResponse({
                'status': 'success',
                'cardState': cardState
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    
    return JsonResponse({'status': 'error', 'message': 'Only POST requests are allowed'}, status=405)

