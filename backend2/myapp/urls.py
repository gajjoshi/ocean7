from django.urls import path
from . import views
# from .views import assign_card_to_section

urlpatterns = [
    path('api/receive-data/', views.receive_data, name='receive_data'),  
    path('api/get-data/', views.get_data, name='get_data'),
    path('api/assign_card/<int:section_id>/', views.assign_card_to_section, name='assign_card_to_section'),
    path('api/update_card_state/', views.update_card_state, name='update_card_state'),
    path('api/reset_card_state/', views.reset_card_state, name='reset_card_state'),
    path('api/reveal_joker/', views.reveal_joker_card, name='reveal_joker_card'),

]